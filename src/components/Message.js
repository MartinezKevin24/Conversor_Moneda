import "../scss/components/_messageStyle.scss";

export default function Message({message}){
    return(
        <>
            <div className="container">
                <div className="container-inside">
                    <span>{message}</span>
                </div>
            </div>
        </>
    );
}