import AddPrayer from "./components/AddPrayer/AddPrayer";
import MyPrayers from "./components/MyPrayers/MyPrayers";
import PublicPrayers from "./components/PublicPrayers/PublicPrayers";
import AuthScreen from "./screens/AuthScreen/AuthScreen";

function App() {
    return (
        <div>
            <p>Prayer Wall 2!</p>

            <p>App is up and change are made</p>
            <AuthScreen />
            <AddPrayer />
            <MyPrayers />
            <PublicPrayers />
        </div>
    );
}

export default App;
