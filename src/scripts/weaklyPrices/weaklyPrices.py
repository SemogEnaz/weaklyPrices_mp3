# TODO: Handle the click interception, sometimes it is intercepted and not
#       caught by selenium and enters the except case. Need to close clicked
#       window.

from bs4 import BeautifulSoup

import re
from httpcore import TimeoutException

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import ElementClickInterceptedException

from modules.item import Item
from modules.catagory import Catagory

import csv
import os

URL = 'https://www.coles.com.au/catalogues'

def init_selenium():

    options = Options()
    # Opens selenium in the background
    #options.add_argument("--headless")

    driver = webdriver.Chrome(options=options)

    return driver

def get_html(driver, url, wait_for_this_id):

    wait_duration = 60
    
    driver.get(url)

    # Wait for a specific element to load
    WebDriverWait(driver, wait_duration).until(
        EC.presence_of_element_located((By.ID, wait_for_this_id))
    )

    html = driver.page_source

    return html

def get_soup(html) -> BeautifulSoup:

    return BeautifulSoup(html, 'lxml')

def get_weekly_catalogue_link(driver):

    id = 'sf-weekly'

    html = get_html(driver, URL, id)

    popup_close_button = WebDriverWait(driver, 5).until(lambda x: x.find_element(By.CSS_SELECTOR, '.close-button.coles-targeting-ButtonButton.button'))

    try:
        popup_close_button.click()
    except NoSuchElementException:
        pass

    soup = get_soup(html)

    catalogue_cards = soup.find(attrs={'id':'sf-weekly'})
    catalogue_link = catalogue_cards.find(
        'a', 
        {
            'href':re.compile('^(/catalogues/view).*$'),
            'aria-label':re.compile('.(week).*$')
            },
        string='View catalogue'
        )

    return 'https://www.coles.com.au' + catalogue_link.attrs['href']

def get_catagories(html) -> list[Catagory]:

    soup = get_soup(html)
    catagory_nav_bar = soup.find(id='sf-navcategories')
    catagory_link_tags = catagory_nav_bar.findAll('a')

    catagories = []

    for link_tag in catagory_link_tags:

        name = link_tag.attrs['title']
        link = URL + '/view' + link_tag.attrs['href']

        catagory = Catagory(name, link)

        catagories.append(catagory)

    return catagories

# TODO: This will need some majour updates :(
def show_most_items(driver, link) -> BeautifulSoup:

    get_html(driver, link, 'sf-items-table') # Just for navagating the driver to the page

    while True:

        try:
            load_more_button = WebDriverWait(driver, 2).until(lambda x: x.find_element(By.ID, "show-more"))
        except (TimeoutException, NoSuchElementException):
            # If load-more button does not exist, then all items are displayed
            break

        if 'display: none' in load_more_button.get_attribute('style'):
            break

        scroll_to(driver, "show-more")

        try:
            load_more_button.click()
        except ElementNotInteractableException:
            break
        except ElementClickInterceptedException:
            print(' :( ', end="")
            try:
                scroll_to(driver, "show-more")
                WebDriverWait(driver, 4).until(EC.visibility_of(load_more_button))
                WebDriverWait(driver, 4).until(EC.element_to_be_clickable(load_more_button))
                load_more_button.click()
            except:
                scroll_to(driver, "show-more")
                print(" Fuck ", end="")
                

def scroll_to(driver, element_id: str) :
    # https://www.selenium.dev/documentation/webdriver/actions_api/wheel/
    iframe = driver.find_element(By.ID, element_id)

    #ActionChains(driver).scroll_to_element(iframe).perform()

    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", iframe)


def populate_items(driver, catagory: Catagory) -> None:

    show_most_items(driver, catagory.link)

    soup = get_soup(driver.page_source)

    item_table = soup.find('div', id='sf-items-table')
    item_elements = item_table.findAll('div', {'class':'sf-item-details'})

    for index, item_element in  enumerate(item_elements):

        if index % 4 == 0:
            print('.', end='')

        name = item_element.find('h4').get_text()

        try:
            old_price = item_element.find(attrs={'class':'sf-regoptiondesc'}).get_text()
        except AttributeError:
            # Skip items that are not on sale
            continue

        try:
            old_price = float(old_price[old_price.index('$')+1:old_price.index(',')])
        except ValueError:
            # This manages things that are 'Down Down'
            try:
                start_index = old_price.index('$')+1
                end_index = old_price[start_index:].index(' ') + start_index

                old_price = float(old_price[start_index:end_index])

            except ValueError:
                # Some alchole has a was and now price only
                try:
                    old_price = item_element.find(attrs={'class':'sf-regprice'}).get_text()[1:]
                    old_price = float(old_price)
                except (ValueError, AttributeError):
                    # This part of the code will ignore things that are where you save
                    # money on buying two of something
                    continue

        try:
            new_price = item_element.find(attrs={'class':'sf-pricedisplay'}).get_text()
        except AttributeError:
            print(item_element.prettify())
            print('sf-pricedisplay not avaliable')
            continue


        new_price = float(new_price[new_price.index('$')+1:])

        item = Item(name, old_price, new_price)

        catagory.add_item(item)

        # print(name)

def get_catalogue(driver, html) -> list[Catagory]:

    catagories = get_catagories(html)

    print('Gettings items from:')
    
    for catagory in catagories:
        print('  ' + catagory.name, end='')
        populate_items(driver, catagory)
        print()

    return catagories

def write_catalogue_to_csv(catalogue: list[Catagory], dir_name: str) -> None:

    for catagory in catalogue:
        headings = ['name', 'old_price', 'new_price']

        data = [headings]

        try:
            for item in catagory.items:
                data.append([item.name, item.old_price, item.new_price])
        except AttributeError:
            continue

        file_name = os.path.join(dir_name, f'{catagory.name}.csv')

        with open(file_name, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)

def get_top_drops(all_items: list[Item], item_count: int) -> list[Item]:

    sorted_items = sorted(all_items, key=lambda item: item.old_price - item.new_price, reverse=True)
    
    return sorted_items[:item_count]

def main():

    driver = init_selenium()

    catalogue_link = get_weekly_catalogue_link(driver)
    catalogue_html = get_html(driver, catalogue_link, 'sf-catalogue')
    catalogue = get_catalogue(driver, catalogue_html)

    top_five = get_top_drops(catalogue[0].items, 10)

    catagory = Catagory('top', '')

    print()
    for item in top_five:
        print(item.name, item.old_price, item.new_price)
        #catagory.add_item(item)
    print()

    write_catalogue_to_csv(catalogue, "./coles_catalogue/")

    #write_catalogue_to_csv([catagory], "./coles_catalogue/")

    driver.quit()

main()
