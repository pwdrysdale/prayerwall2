import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddComment from "./components/AddComment.tsx/AddComment";

import AddPrayer from "./components/AddPrayer/AddPrayer";
import EditPrayer from "./components/EditPrayer/EditPrayer";
import MyPrayers from "./components/MyPrayers/MyPrayers";
import Navbar from "./components/Navbar/Navbar";
import PublicPrayers from "./components/PublicPrayers/PublicPrayers";
import AuthScreen from "./screens/AuthScreen/AuthScreen";

function App() {
    return (
        <Router>
            <p>Prayer Wall 2!</p>

            <p>App is up and change are made</p>
            <Navbar />
            <Switch>
                <Route path="/login" component={AuthScreen} exact />
                <Route path="/prayer/add" component={AddPrayer} exact />
                <Route path="/prayer/my" component={MyPrayers} exact />
                <Route path="/prayer/public" component={PublicPrayers} exact />
                <Route path="/prayer/edit/:id" component={EditPrayer} exact />
                <Route
                    path="/prayer/addcomment/:id"
                    component={AddComment}
                    exact
                />
            </Switch>
        </Router>
    );
}

export default App;
