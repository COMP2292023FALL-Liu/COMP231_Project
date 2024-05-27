const UserService = require("../services/UserService")
const JWT = require("../util/JWT")


const UserController = {
    addUser:async (req,res)=>{
        console.log(req.body)
        const {userID, username, password,userType,userInfo} = req.body

        await UserService.addUser(userID, username, password,userType,userInfo)
        res.send({
            ok:1
          })
      },

      updateUser:async (req,res)=>{
        console.log(req.body,req.params.myid)
        const {userID, username, password,userType,userInfo} = req.body
        await UserService.updateUser(req.params.myid,userID, username, password,userType,userInfo)
        res.send({
            ok:1
          })
        
      },
      deleteUser:async (req,res)=>{

        await UserService.deleteUser(req.params.id)

        res.send({
            ok:1
          })
      },
      getUser:async (req,res)=>{
        console.log(req.query)
        const {page,limit} = req.query
        const data = await UserService.getUser(page,limit)

        res.send(data)
      },

      login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await UserService.login(username, password);
            if (!user || user.length === 0) {
                res.status(401).send({ ok: 0, message: 'Login failed. Check your credentials.' });
            } else {
                const token = JWT.generate({
                  _id: user[0]._id,
                  userID: user[0].userID,
                  username: user[0].username,
                  userType: user[0].userType
                }, "1d");
                res.header("Authorization", `Bearer ${token}`);
                res.status(200).send({ ok: 1, userType: user[0].userType });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send({ ok: 0, message: 'Internal server error. Please try again later.' });
        }
    },
    
      logout:(req,res)=>{
        req.session.destroy(()=>{
          res.send({ok:1})
        })
      }
}

module.exports = UserController