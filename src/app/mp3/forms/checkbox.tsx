export function makeCheckboxsRaw(contents: string[], values: string[], attribute: string) {
    const checkboxes = [];

    if (contents.length != values.length) throw new Error("ERROR contents != values");

    for (let i = 0; i < contents.length; i++) {
        checkboxes.push({ 
            content: contents[i],
            value: values[i],
            attribute: attribute
        });
    }

    return checkboxes;
};

export function makeCheckboxes(
    checkboxes: {content: string, value: string, attribute: string}[],
    state: {options: any, setOptions: (options: any) => void}) {

    const handleClick = (element: any) => {
        state.setOptions((option: any) => ({
            ...option,
            [element.attribute]: 
            option[element.attribute] == element.value ? 
            '' : element.value
        }));
    }

    return (
        <>
            {checkboxes.map((element) => (
                    <Checkbox
                        key={element.value}
                        content={element.content}
                        isChecked={state.options[element.attribute] == element.value}
                        hasFormat={true}
                        handleClick={() => handleClick(element)} />
                )
            )}
        </>
    );
};

export function makeDependingCheckboxes(
    checkboxes: {content: string, value: string, attribute: string}[],
    state: {options: any, setOptions: (options: any) => void},
    trigger: boolean) {

    const handleClick = (element: any) => {
        
        // Set value on trigger
        if (trigger)
            state.setOptions((option: any) => ({
                ...option,
                [element.attribute]: 
                option[element.attribute] == element.value ? '' : element.value
            }));
    }

    /*
    // Set empty values/reset on false trigger
    if (!trigger)
        console.log(`Setting value of attribute to ''`)
        state.setOptions((option: any) => ({
            ...option,
            [option.attribute]: '',
        }));
    */

    return (
        <>
            {checkboxes.map((element) => (
                <Checkbox
                    key={element.content}
                    content={element.content}
                    isChecked={state.options[element.attribute] == element.value}
                    hasFormat={trigger}
                    handleClick={() => handleClick(element)} />
            ))}
        </>
    );
};

export const formOptions = (title: string, component: any): any => {
    return (
        <div className="form-options">
            <div>{title}</div>
            {component}
        </div>
    );
};

export const checkboxOptions = (elements: any): any => {
    return (
        <div className="checkbox-options">
            {elements}
        </div>
    );
}

type CheckboxProps = {
    content: string,
    isChecked: boolean, 
    hasFormat: boolean,
    handleClick : (options: any) => void
};

export function Checkbox({ content, isChecked, hasFormat, handleClick }: CheckboxProps) {

    const colorClass = hasFormat ? (isChecked ? 'checked' : '') : 'blocked';
    //const colorClass = isChecked ? 'checked' : hasFormat ? '' : 'blocked';

    return (
        <div className="checkbox">

            <div
                className={`box ${colorClass}`}
                onClick={handleClick}></div>

            <div className="label">{content}</div>

        </div>
    );
};