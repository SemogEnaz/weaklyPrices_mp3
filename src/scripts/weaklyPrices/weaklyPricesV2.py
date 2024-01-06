# TODO: Don't use selenium
# TODO: Add item links
# TODO: 

import csv
import os
import time

from modules.catagory import Catagory
from modules.item import Item

import requests
from bs4 import BeautifulSoup
from selenium import webdriver

root_dir = 'https://www.coles.com.au'
special = '/on-special'
coles_catalogue_dir = './coles_catalogue/'

def soup_from_link(link: str) -> BeautifulSoup:

    r = requests.get(link)
    soup = BeautifulSoup(r.text, 'lxml')

    return soup

def find_one_class(soup: BeautifulSoup, class_id: str):
    return soup.find(attrs={'class':class_id})

def parse_price(price_str: str):
    index = price_str.find('$')
    return price_str[index + 1:]

def parse_name(name: str):
    index = name.find('|')
    return name[:index - 1]

# Taken from weaklyPricesV1 ;)
def write_catalogue_to_csv(catalogue: list[Catagory], dir_name: str) -> None:

    for catagory in catalogue:
        headings = ['name', 'old_price', 'new_price', 'link']

        data = [headings]

        for item in catagory.items:
            data.append([item.name, item.old_price, item.new_price, item.link])

        file_name = os.path.join(dir_name, f'{catagory.name}.csv')

        with open(file_name, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)

soup = soup_from_link(root_dir + special)

nav_bar_class = 'coles-targeting-ScrollContainerContainer'
nav_bar = soup.find(attrs={"class":nav_bar_class})

link_elements = nav_bar.find_all('a')
links = [link.get('href') for link in link_elements if link.get('href') != '#']

# Error element class
error_page_class = 'coles-targeting-StylesErrorPageStylesTitle'

# Finding the item tiles
items_table_class = 'coles-targeting-StylesCategoryStylesProductListContainer'
item_class = 'coles-targeting-ProductTileProductTileWrapper'

# Product details
catagory_name_class = 'coles-targeting-ProductHeadingHeadingContainer'
link_class = 'product__link'
name_class = 'product__title'
new_price_class = 'price__value'
old_price_class = 'price__was'

# Request page number
page_request = '?page='
total_page_count = 0
total_item_count = 0

catalogue = []

sleep_timeout = 10

# Getting items for all catagories
for link in links:

    # Getting first page
    soup = soup_from_link(root_dir + link)

    # Getting name of catagory
    try:
        catagory_name = find_one_class(soup, catagory_name_class).find('h1').get_text()
    except:
        print(f'ERROR AT read catagory name of {link}')

        while True:
            time.sleep(sleep_timeout)
            sleep_timeout *= 2

            soup = soup_from_link(root_dir + link)

            try:
                catagory_name = find_one_class(soup, catagory_name_class).find('h1').get_text()
            except:
                print(f'ERROR while handling, sleeping ({sleep_timeout}sec)')
                continue

            break

    print(f'{catagory_name}')
    
    # New catagory object initilized with link to page
    catagory = Catagory(catagory_name, root_dir + link)

    page_count = 2

    # Getting all pages from catagory
    while True:

        items_table = ''
        items = ''

        # If error displayed on page, next catagory
        if find_one_class(soup, error_page_class):
            print(f'\tPage count: {page_count - 2}', end='\n\t')
            break

        # Find items table
        items_table = find_one_class(soup, items_table_class)

        try:
            items = items_table.find_all(attrs={'class':item_class})
        except:

            print(f'\n\nERROR AT item_count:{len(catagory.items)} page_count:{page_count}...\nGoing to sleep (-___-) zzzz ({sleep_timeout}sec)\n')

            while True:
                time.sleep(sleep_timeout)
                sleep_timeout *= 2   # Doubling sleep count

                soup = soup_from_link(root_dir + link + page_request + str(page_count))

                try:
                    items_table = find_one_class(soup, items_table_class)
                    items = items_table.find_all(attrs={'class':item_class})
                except:
                    print(f'\nERROR while handeling, looping\nSleeping for {sleep_timeout}sec')
                    continue

                break

        # Make item objects from items table and store in catagory obj
        for item in items:

            # Item attributes
            item_link = find_one_class(item, link_class).get('href')
            item_name = find_one_class(item, name_class).get_text()

            try:
                item_old_price = find_one_class(item, old_price_class).get_text()
            except:
                continue

            item_new_price = find_one_class(item, new_price_class).get_text()

            item_name = parse_name(item_name)
            item_old_price = parse_price(item_old_price)
            item_new_price = parse_price(item_new_price)

            catagory.add_item(Item(item_name, item_old_price, item_new_price, root_dir + item_link))
            total_item_count += 1

        # Getting next page
        soup = soup_from_link(root_dir + link + page_request + str(page_count))

        page_count += 1     # Updating to next page and continue while loop
        total_page_count += 1
    
    # After catagory is fully read, add to catalogue array
    catalogue.append(catagory)
    print(f'Item count: {len(catagory.items)}')

print(f'\nTotal pages read: {total_page_count}')
print(f'Total items saved: {total_item_count}')

write_catalogue_to_csv(catalogue, coles_catalogue_dir)
print(f'Data written to {coles_catalogue_dir}! :)')

driver = webdriver.Chrome()

