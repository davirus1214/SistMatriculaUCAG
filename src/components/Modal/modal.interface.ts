export interface modalProps{
    id: string
    buttonStyle: string
    modalTitle: string
    buttonName:string | JSX.Element;
    modalName:string
    body:string
    secondaryButtonText:string
    primaryButtonText:string
    classSecondaryButton: string
    classPrimaryButton: string
    functionButtonOption: () => void;

}