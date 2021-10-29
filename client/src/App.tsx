import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddComment from "./components/AddComment.tsx/AddComment";

import AddPrayer from "./components/AddPrayer/AddPrayer";
import EditPrayer from "./components/EditPrayer/EditPrayer";
import Events from "./components/Events/Events";
import Following from "./components/Following/Following";
import FollowingPrayers from "./components/FollowingPrayers/FollowingPrayers";
import MyPrayers from "./components/MyPrayers/MyPrayers";
import Navbar from "./components/Navbar/Navbar";
import PublicPrayers from "./components/PublicPrayers/PublicPrayers";
import Toasts from "./components/Toasts/Toasts";
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
                <Route
                    path="/prayer/following"
                    component={FollowingPrayers}
                    exact
                />
                <Route path="/user/following" component={Following} exact />
            </Switch>
            <Events />
            <Toasts />
        </Router>
    );
}

export default App;
