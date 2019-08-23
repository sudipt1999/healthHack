class User {
    constructor() {
        console.log("construction called");
        this.userList = [];
    }
    /*
        Basically we reuire 4 function !
        1.addUser(data) to store data;
        2.deleteUser(id) to delete data when user leaves the chat room
        3.findUser() to find user
        4.findRoomUser(roomName) to return user in a room!
    */

    addUser({ id, name, room }) {
        console.log("inside addUser function");
        const newUser = {
            id,
            name,
            room
        }
        this.userList.push(newUser);
        console.log("AFTER ADDING USERS", this.userList);
    }

    deleteUser(id) {
        console.log("in delete user");
        let deletedUser;
        const newUserList = this.userList.filter((user) => {
            if (user.id === id) {
                deletedUser = user;
            }
            return user.id !== id
        });
        this.userList = newUserList;
        console.log("AFTER DELETION OF USER", this.userList);
        return deletedUser;
    }

    findUser(id) {
        console.log("inside find user");
        const user = this.userList.filter((user) => user.id === id);
        console.log("current user list", this.userList);
        console.log("user found ", user);
        return user[0];
    }

    findRoomUser(room) {
        console.log("inside the find room users ");
        const users = this.userList.filter(user => user.room === room);
        console.log("Users in room", room, users);
        return users;
    }

}


module.exports = User;