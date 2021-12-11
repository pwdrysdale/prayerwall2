import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddComment from "./components/AddComment.tsx/AddComment";
import AddList from "./components/AddList.tsx/AddList";

import AddPrayer from "./components/AddPrayer/AddPrayer";
import EditPrayer from "./components/EditPrayer/EditPrayer";
// import Events from "./components/Events/Events";
import Following from "./components/Following/Following";
import FollowingPrayers from "./components/FollowingPrayers/FollowingPrayers";
import MyLists from "./components/MyLists/MyLists";
import MyPrayers from "./components/MyPrayers/MyPrayers";
import Navbar from "./components/Navbar/Navbar";
import PublicPrayers from "./components/PublicPrayers/PublicPrayers";
import Toasts from "./components/Toasts/Toasts";
import User from "./components/User/User";
import AuthScreen from "./screens/AuthScreen/AuthScreen";
import GiveScreen from "./screens/GiveScreen/GiveScreen";

import "./GlobalStyles.css";
import List from "./components/List/List";
import FrontScreen from "./screens/GiveScreen/FrontScreen/FrontScreen";
import { userInfo } from "./store/userInfo";
import { useQuery } from "@apollo/client";
import { useToasts } from "./store/useToasts";
import { loader } from "graphql.macro";
import Footer from "./components/Footer/Footer";
import Events from "./components/Events/Events";
import EditList from "./components/EditList/EditList";

const Me = loader("./screens/AuthScreen/Me.graphql");

function App() {
    const { setUser, user } = userInfo();
    const { addToast } = useToasts();

    const { data: me } = useQuery(Me);

    useEffect(() => {
        console.log(me);
        if (me?.me && user !== me.me) {
            addToast({ message: "Logged in", type: "success" });
        }
        if (me && me.me) {
            setUser(me.me);
        }
        console.log("User: ", user);
    }, [me, setUser, user, addToast]);

    return (
        <Router>
            <div className="main-container">
                <Navbar />

                <Switch>
                    <Route exact path="/" component={FrontScreen} />
                    <Route path="/login" component={AuthScreen} exact />
                    <Route path="/prayer/add" component={AddPrayer} exact />
                    <Route path="/prayer/my" component={MyPrayers} exact />
                    <Route
                        path="/prayer/public"
                        component={PublicPrayers}
                        exact
                    />
                    <Route
                        path="/prayer/edit/:id"
                        component={EditPrayer}
                        exact
                    />
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
                    <Route path="/lists/my" component={MyLists} exact />
                    <Route path="/lists/add" component={AddList} exact />
                    <Route path="/lists/edit/:id" component={EditList} exact />
                    <Route path="/lists/:id" component={List} exact />
                    <Route path="/user/following" component={Following} exact />
                    <Route path="/user/:id" component={User} exact />
                    <Route path="/give" component={GiveScreen} exact />
                </Switch>
                <Events />
            </div>
            <Footer />
            <Toasts />
        </Router>
    );
}

export default App;
