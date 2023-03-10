import React, { useEffect } from "react";
import dotenv from "dotenv"
import axios from "axios";
import { Link } from "react-router-dom";

import makeToast from "../Toaster"

dotenv.config()

const DashboardPage = (props) => {
    const [chatrooms, setChatrooms] = React.useState([]);
    const getChatrooms = () => {
        axios
            .get(`${process.env.REACT_APP_DOMAIN}/chatroom`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            })
            .then((response) => {
                setChatrooms(response.data);
            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000);
            });
    };

    React.useEffect(() => {
        getChatrooms();
        document.title = "Dashboard";
        // eslint-disable-next-line
    }, []);

    const createChatroom = () => {
        const chatroomName = chatroomNameRef.current.value;

        axios
            .post(`${process.env.REACT_APP_DOMAIN}/chatroom`, {
                name: chatroomName,
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                },
            })
            .then((response) => {
                makeToast("success", response.data.message);
                getChatrooms();
                chatroomNameRef.current.value = "";
            })
            .catch((err) => {
                // console.log(err);
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                    makeToast("error", err.response.data.message);
            });
    };
    const logout = (event) => {
        event.preventDefault();
        localStorage.removeItem("CC_Token");
        window.location.href = 'http://localhost:3000/login'
    }

    const chatroomNameRef = React.createRef();

    return (
        <div className="card">
            <div className="logout">
                <a href="/login" onClick={logout}>????ng xu???t</a>
            </div>
            <div className="cardHeader">T???t c??? ph??ng chat</div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="chatroomName">T???o ph??ng</label>
                    <input
                        type="text"
                        name="chatroomName"
                        id="chatroomName"
                        ref={chatroomNameRef}
                        placeholder="Nh???p t??n ph??ng chat"
                    />
                </div>
            </div>
            <button onClick={createChatroom}>T???o m???i ph??ng chat</button>
            <div className="chatrooms">
                {chatrooms.map((chatroom) => (
                    <div key={chatroom._id} className="chatroom">
                        <div>{chatroom.name}</div>
                        <Link to={"/chatroom/" + chatroom._id}>
                            <div className="join">Tham gia</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
