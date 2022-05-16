import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {fromCurrency, insertCurrencies, insertData} from "../store/actions";
import Options from "./Options";
import "../scss/components/_changeStyle.scss";
import Message from "./Message";

export default function Change(){

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("EUR");
    const [coins, setCoins] = useState("");
    const [loading, setLoading] = useState(false)
    const [money, setMoney] = useState(1);
    const [codes, setCodes] = useState({currencies: ['EUR']});
    const [errors, setErrors] = useState(null);
    const [results, setResults] = useState([]);
    const [resets, setResets] = useState(false);

    const base = useSelector(state => { return state.convert.dataBase});
    const latestData = useSelector(state => { return state.convert.dataLatest});
    const currencies = useSelector(state => { return state.convert.dataCurrencies});
    const fromData = useSelector(state => { return state.convert.fromData});
    const dispatch = useDispatch();

    useEffect(()=>{

        const dataCurrency = async() => {

            setLoading(true);

            if(from === ""){
                setFrom("USD");
            }

            if(!currencies || from === ""){
                const res = await axios.get("https://api.currencyapi.com/v3/currencies?apikey=CmvXP1wcluguz5ctXIzMcXTtUsnFWw0Ikco8z7JX&currencies=");
                dispatch(insertData(res.data));
                setCoins(res.data.data);
            }
            if(from !== fromData || resets || from === ""){
                const resT = await axios.get(`https://api.currencyapi.com/v3/latest?apikey=CmvXP1wcluguz5ctXIzMcXTtUsnFWw0Ikco8z7JX&currencies=&base_currency=${from}`);
                dispatch(fromCurrency(from));
                dispatch(insertCurrencies(resT.data))
                if(resets){
                    setResets(false);
                }
            }
            setLoading(false);
        }

        if(from === "" && currencies !== null){
            setCoins(currencies);
        }

        if(from === "" && fromData !== null){
            setFrom(fromData);
        }

        dataCurrency();

    },[from, resets]);

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

    const removeCoin = (moneda) => {
        let arrayResult = [], arrayConv = [];
        arrayConv = codes.currencies.filter((currency)=> currency !== moneda);
        setCodes({currencies: arrayConv});

        arrayResult = results.filter((total) => total !== results[codes.currencies.indexOf(moneda)])
        setResults(arrayResult);

    }

    const add = () => {
        let array = codes.currencies;
        if(array.indexOf(to) < 0) {
            array.push(to);
            setCodes({currencies: array});
        }
    }

    const reset = () => {
        setResets(true);
    }

    const handleChange = (e) => {

        switch (e.target.name){
            case "base":
                setFrom(e.target.value);
                setCodes({...codes, currencies: ['EUR']})
                break;
            case "currency":
                setTo(e.target.value)
                break;
            case "money":
                setMoney(e.target.value);
                break;
            default:
                break;
        }

    }

    const handleSubmit = (e) => {

        e.preventDefault();
        let valores = [];

        if(validate()){
            codes.currencies.map((curr, i)=>{
                const valor = parseFloat(money) * base[curr].value;
                return valores.push(valor.toFixed(coins[curr].decimal_digits));
            });

            setResults(valores);
        }

    }

    return(
        <>
            <div className="container-all">
                <div className="container-form">
                    {typeof coins !== "string" && currencies !== null && base !== null ?
                        <form onSubmit={handleSubmit}>
                            <div className="from">
                                <label>
                                    <p>From: </p>
                                    <select name="base" value={from} onChange={handleChange} disabled={loading}>
                                        {Object.keys(coins).map((coin, i)=>
                                            <option key={i} value={coins[coin].code}>{coins[coin].code} - {coins[coin].name_plural}</option>
                                        )}
                                    </select>
                                </label>
                                <input type="number" name="money" align={"right"} value={money} onChange={handleChange}/>
                            </div>
                            <div className="to">
                                <div className={"inputs"}>
                                    <p>To: </p>
                                    <select name="currency" value={to} onChange={handleChange}>
                                        {Object.keys(base).map((coin, i)=>
                                            <option key={i} value={coins[coin].code}>{coins[coin].code} - {coins[coin].name_plural}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="add" onClick={add}>+</div>
                            </div>
                            {
                                codes.currencies.length !== 0 ?
                                    <div className={"coins"}>
                                        {codes.currencies.map((select, i)=>
                                            <Options text={select} key={i} remove={removeCoin}/>
                                        )}
                                    </div>
                                    :null
                            }
                            <input type="submit" value="Convertir"/>
                            <div className="reset" onClick={reset}>Reset</div>
                        </form>
                        : null}
                </div>
                <div className="container-result">
                    <h2>Tasa de cambio a:</h2>
                    {
                        latestData !== null ?
                            <p className={"latest"}>Ultima actualización: {latestData}</p>
                            :null
                    }
                    {
                        errors ? <Message message={errors}/> : results.length !== 0 ?
                            results.map((result, i)=>{
                                return <p key={i}><span>{coins[codes.currencies[i]].symbol}</span> <span>{result}</span></p>
                            })
                            : null
                    }
                </div>
            </div>
        </>
    );
}