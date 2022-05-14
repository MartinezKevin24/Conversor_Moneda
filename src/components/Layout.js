import "../scss/components/_layoutStyle.scss";

export default function Layout({children}){
    return(
        <>
            <div className="container-header">
                <div className="container-inside">
                    <img src="./logo.png" alt="Logotipo" width={180}/>
                </div>
            </div>
            <main>{children}</main>
        </>
    );
}