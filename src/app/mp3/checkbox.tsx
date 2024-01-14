import React from "react";

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
}

export function makeCheckboxes(
    checkboxes: {content: string, value: string, attribute: string}[],
    state: {options: any, setOptions: (options: any) => void}) {

    return (
        <div className="checkbox-options">
            {checkboxes.map((element) => (
                    <Checkbox
                        key={element.value}
                        args={{
                            content: element.content,
                            value: element.value,
                            attribute: element.attribute
                        }}
                        state={state} />
                )
            )}
        </div>
    );
}

export const formOptions = (title: string, component: any): any => {
    return (
        <div className="form-options">
            <div>{title}</div>
            {component}
        </div>
    );
}

type CheckboxProps = {
    args: {
        content: string,
        value: string,
        attribute: string
    }, state: {
        options: any;
        setOptions: (options: any) => void;
    }
};

function Checkbox({ args, state }: CheckboxProps) {

    const { content, value, attribute } = { ...args };
    const { options, setOptions } = state;

    const isChecked = options[attribute] == value;

    const handleClick = () => {
        setOptions((option: any) => ({
            ...option,
            [attribute]: option[attribute] == value ? '' : value
        }));
    }

    return (
        <div className="checkbox">

            <div 
                className={`box  ${isChecked ? 'checked' : ''}`}
                onClick={handleClick}></div>

            <div className="label">{content}</div>

        </div>
    );
};