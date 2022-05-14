import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {fromCurrency, insertCurrencies, insertData} from "../store/actions";

export default function Change(){

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("EUR");
    const [coins, setCoins] = useState("");
    const [loading, setLoading] = useState(false)
    const [money, setMoney] = useState(1);
    const [conv, setConv] = useState({
        currencies: ['EUR'],
        latest: "",
        data: ""
    });
    const [errors, setErrors] = useState(null);
    const [results, setResults] = useState([])

    const base = useSelector(state => { return state.convert.dataBase});
    const latestData = useSelector(state => { return state.convert.dataLatest});
    const currencies = useSelector(state => { return state.convert.dataCurrencies});
    const fromData = useSelector(state => { return state.convert.fromData});
    const dispatch = useDispatch();

    useEffect(()=>{

        const dataCurrency = async() => {
            setLoading(true);
            if(!currencies){
                const res = await axios.get("https://api.currencyapi.com/v3/currencies?apikey=IcRzEoRNDvfaDTL8RYAxylEwkWKihuvdtwtqeGYe&currencies=");
                dispatch(insertData(res.data));
                setCoins(res.data.data);
            }
            if(from !== fromData){
                const resT = await axios.get(`https://api.currencyapi.com/v3/latest?apikey=IcRzEoRNDvfaDTL8RYAxylEwkWKihuvdtwtqeGYe&currencies=&base_currency=${from}`);
                dispatch(fromCurrency(from));
                dispatch(insertCurrencies(resT.data))
                setConv({...conv, latest: resT.data.meta.last_updated_at});
            }
            setLoading(false);
        }

        if(from === "" && currencies !== null){
            setCoins(currencies);
        }

        if(from === "" && fromData !== null){
            setFrom(fromData);
        }

        if(from !== ""){
            dataCurrency()
        }else{
            setCoins(currencies);
            setConv({...conv, data: base, latest: latestData});
        }

    },[from]);

    const handleChange = (e) => {

        switch (e.target.name){
            case "base":
                setFrom(e.target.value);
                break;
            case "currency":
                let array = conv.currencies;
                array.push(e.target.value);
                setConv({...conv, currencies: array});
                setTo(e.target.value);
                break;
            case "money":
                setMoney(e.target.value);
                break;
        }

    }

    const validate = () => {

        let error = null;

        const a = money.toString().split(".");

        if(!(a.length <= 2)){
            error = "El formato de moneda ingresado no es valido.";
        }

        if(a.length === 2 && a[1].length > coins[from].decimal_digits){
            error = `La cantidad de decimales para ${from} es invalida .`;
        }

        setErrors(error);

        return !error;

    }

    const handleSubmit = (e) => {

        e.preventDefault();
        let valores = [];

        if(validate()){
            conv.currencies.map((curr, i)=>{
                const valor = parseFloat(money) * conv.data[curr].value;
                valores.push(valor.toFixed(3));
            });

            setResults(valores);
        }

    }

    return(
        <>
            <div className="container-form">
                {typeof coins !== "string" ?
                    <form onSubmit={handleSubmit}>
                        <p>From: </p>
                        <select name="base" value={from} onChange={handleChange} disabled={loading}>
                            {Object.keys(coins).map((coin, i)=>
                                <option key={i} value={coins[coin].code}>{coins[coin].code} - {coins[coin].name_plural}</option>
                            )}
                        </select>
                        <input type="number" name="money" value={money} onChange={handleChange}/>
                        <p>To: </p>
                         <select name="currency" value={to} onChange={handleChange}>
                            {Object.keys(coins).map((coin, i)=>
                                <option key={i} value={coins[coin].code}>{coins[coin].code} - {coins[coin].name_plural}</option>
                            )}
                        </select>
                        <input type="submit" value="Submit"/>
                    </form>
                : null}
                {
                    results.length !== 0 ?
                        results.map((result, i)=>{
                            return <p key={i}>{conv.currencies[i]} {result}</p>
                        })
                    : null
                }
            </div>
        </>
    );
}