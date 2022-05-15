import './App.scss';
import Layout from "./components/Layout";
import Change from "./components/Change";

function App() {
  return (
    <div className="App">
      <Layout>
        <div className="container-change">
            <Change/>
        </div>
      </Layout>
    </div>
  );
}

export default App;
