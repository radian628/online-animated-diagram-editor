import { useState } from "react";

export type TwoStepButtonProps = {
    onFirstClick?: () => void
    onFinalClick: () => void
    shouldUseTwoSteps?: boolean
    children: React.ReactNode,
    secondStepContent?: React.ReactNode | string,
    timeout?: number,
    className?: string,
    style?: React.CSSProperties
}

export function TwoStepButton(props: TwoStepButtonProps) {
    const [isSecondStep, setIsSecondStep] = useState(false);

    if (isSecondStep) {
        setTimeout(() => {
            setIsSecondStep(false);
        }, props.timeout ?? 5000);
    }

    return (<button style={props.style} className={props.className} onClick={
        () => {
            if (props.shouldUseTwoSteps ?? true) {
                if (isSecondStep) {
                    props.onFinalClick();
                    setIsSecondStep(false);
                } else {
                    setIsSecondStep(true);
                    if (props.onFirstClick) props.onFirstClick();
                }
            } else {
                props.onFinalClick();
            }
        }
    }>{isSecondStep ? (props.secondStepContent ?? "Are you sure?") : props.children}</button>);
}