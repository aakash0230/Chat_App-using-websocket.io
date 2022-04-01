const expect = require('expect');

const {Users} = require("./users");

describe('Users', () => {

    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id : "1",
            name : "Aakash",
            room : "Bhaukal"
        },
        {
            id : "2",
            name : "vikas",
            room : "Mirzapur"
        },
        {
            id : "3",
            name : "Anubhav",
            room : "Mirzapur"
        }
    ]

    })

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id : "ssdhdhd",
            name : "Aakash",
            room : "Mirzapur"
        };

        let reUsers = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it("should return names for mirzapur", () => {
        let userList = users.getUserList("Mirzapur");
        
        expect(userList).toEqual(['vikas','Anubhav'])
    });

    it("should return names for Bhaukal", () => {
        let userList = users.getUserList("Bhaukal");
        
        expect(userList).toEqual(['Aakash'])
    });

    it("should find user", () => {
        let userId = '2',
            user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it("should not find user", () => {
        let userId = '150',
            user = users.getUser(userId);

        expect(user).toBeUndefined();
    });

    it("should rempve a user", () => {
        let userId = "1";
            user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it("should not rempve a user", () => {
        let userId = "108";
            user = users.removeUser(userId);

        expect(user).toBeUndefined();
        expect(users.users.length).toBe(3);
    });
})