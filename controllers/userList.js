var catalyst = require('zcatalyst-sdk-node');
const bcrypt = require('bcrypt');
// const auth=require('../Service/auth');
const auth=require('../Middleware/authMiddleware');
// @register user
exports.registerUser = async (req, res, next) => {
    try {
        // console.log(req.body.firstName);
        var dbApp = catalyst.initialize(req);
        var zcql = dbApp.zcql();
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const role = req.body.Role;
        // const avb="35003000000093887";
        const password = req.body.password;
        // 4. Basic validation (optional but good practice)
        if (!firstName || !lastName || !email || !role || !password) {
            return res.status(400).json({
                message: "All fields (firstName, lastName, email, Role, password) are required.",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let query = `INSERT INTO UserList (firstName, lastName, email, password, Role) VALUES ('${firstName}','${lastName}','${email}','${hashedPassword}',${role});`;
        console.log(query);
        const result = await zcql.executeZCQLQuery(query);
        res.status(200).json({ message: "User created successfully!", result });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Failed to register user.",
            error: error.message || error
        });
    }
};


//@login user
exports.loginUser = async (req, res, next) => {
    try {
        var dbApp = catalyst.initialize(req);
        var zcql = dbApp.zcql();
        // console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        let query = `SELECT * FROM UserList WHERE email='${email}';`;
        // console.log(query);
        const result = await zcql.executeZCQLQuery(query);
        // res.status(200).json({message:"user logged in successfull",result})  

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Invalid user email!" });
        }

        const bcryptPassword = await bcrypt.compare(password, result[0].UserList.password);
        if (!bcryptPassword) {
           return res.status(404).json({ message: "Invalid user password!" });
        }
        // const token=auth.setUser(result[0].UserList);
        const token=auth.generateToken(result[0].UserList);
        return  res.status(200).json({ message: "User login successfully!" ,token});
    }
    catch (err) {
       return res.status(500).json({ message: err });
    }
};