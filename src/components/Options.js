import "../scss/components/_optionsStyle.scss";

export default function Options({text, remove}) {

    return(
        <>
            <div className="container-options">
                <div className="options-inside">
                    <span>{text}</span>
                </div>
                <div className="remove" onClick={()=>remove(text)}>
                    <span/>
                </div>
            </div>
        </>
    );
}