import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {insertCurrencies, insertData} from "../store/actions";

export default function Change(){

    const [from, setFrom] = useState("USD");
    const [coins, setCoins] = useState("");
    const [money, setMoney] = useState(1);
    const [conv, setConv] = useState({
        currencies: ['EUR'],
        latest: "",
        data: ""
    })

    const base = useSelector(state => { return state.convert.dataBase});
    const latestData = useSelector(state => { return state.convert.dataLatest});
    const currencies = useSelector(state => { return state.convert.dataCurrencies});
    const dispatch = useDispatch();

    useEffect(()=>{

        const dataCurrency = async() => {
            const res = await axios.get("https://api.currencyapi.com/v3/currencies?apikey=ARJI3DZ9JUPMJkSJddKe5nsEDJdwzyxvZWCHCm67&currencies=");
            dispatch(insertData(res.data));
            setCoins(res.data.data);
            const resT = await axios.get("https://api.currencyapi.com/v3/latest?apikey=ARJI3DZ9JUPMJkSJddKe5nsEDJdwzyxvZWCHCm67&currencies=");
            dispatch(insertCurrencies(resT.data))
            setConv({...conv, latest: resT.data.meta.last_updated_at});
        }

        if(base === null){
            dataCurrency()
        }else{
            setCoins(currencies);
            setConv({...conv, data: base, latest: latestData});
        }

    },[base, latestData, currencies])

    return(
        <>
            <div className="container-form">
                <form>
                    <p>From: </p>
                    {typeof coins !== "string" ? <select name="base" value={from}>
                        {Object.keys(coins).map((coin, i)=>
                            <option key={i} value={coins[coin].code}>{coins[coin].code} - {coins[coin].name_plural}</option>
                        )}
                    </select> : null}
                    <input type="number" value={money}/>
                    <p>To: </p>
                    {typeof coins !== "string" ? <select name="base" value={from}>
                        {Object.keys(coins).map((coin, i)=>
                            <option key={i} value={coins[coin].code}>{coins[coin].code} - {coins[coin].name_plural}</option>
                        )}
                    </select> : null}
                </form>
            </div>
        </>
    );
}