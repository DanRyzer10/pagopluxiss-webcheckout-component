import React from "preact/compat";

interface CustomButtonProps {
    activeButton: () => boolean;
    disabledButton: () => boolean;
    children:React.ReactNode
}

export const SubmitButton = ({activeButton,disabledButton,children}: CustomButtonProps) => {
    return (
        <button
            type="submit"
            className={` ppxiss-button-payiss-pay
                ${activeButton()?'ppxiss-button-active': "ppxiss-button-inactive"}
                `}
            disabled={disabledButton()}
        >
            <span>
                {children}
            </span>
        </button>
    )
}