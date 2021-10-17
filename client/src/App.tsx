import AddPrayer from "./components/AddPrayer/AddPrayer";
import MyPrayers from "./components/MyPrayers/MyPrayers";
import AuthScreen from "./screens/AuthScreen/AuthScreen";

function App() {
    return (
        <div>
            <p>Prayer Wall 2!</p>

            <p>App is up and change are made</p>
            <AuthScreen />
            <AddPrayer />
            <MyPrayers />
        </div>
    );
}

export default App;
