const realEstateRouter = require("express").Router()
const { getTokenFrom } = require("../../utils");
const RealEstate = require("../models/realEstate");
const jwt = require('jsonwebtoken');
const { default: Config } = require("../../config");
const User = require("../models/user");
const { check, validationResult, body } = require("express-validator");
realEstateRouter.get("/get-list-landingpage", async (req, res) => {
    let listRealEstate = await RealEstate.find({ isApprove: Config.APPROVED }).sort({ createTime: -1 }).limit(9);
    return res.status(200).json(listRealEstate).end()
})
realEstateRouter.post("/get-list-favorites", async (req, res) => {
    const token = getTokenFrom(req)
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }
        let user = await User.findById(decodedToken.id);
        let listFavo = [...user.listFavo]
        console.log(user)
        let result = await RealEstate.find({ _id: { $in: listFavo } })
        console.log(result)
        return res.status(200).json(result).end()
    }
    return res.status(400).end()
})
realEstateRouter.post("/get-list-property", async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    let listProperty = await RealState.find({ userId: decodedToken.id })
    return res.status(200).json(listProperty).end()
})
// realEstateRouter.post("/add-favorites" )
realEstateRouter.post("/add-property", [
    check("title", "Tiêu đề không được bỏ trống").isString().isLength({ min: 1 }),
    check("state", "Tỉnh không được bỏ trống").isString().isLength({ min: 1 }),
    check("district", "Quận/huyện không được bỏ trống").isString().isLength({ min: 1 }),
    check("description", "Miêu tả không được bỏ trống").isString().isLength({ min: 1 }),
    check("pricePer", "Tính theo không được bỏ trống").isString().isLength({ min: 1 }),
    check("typeRealEstate", "Loại không được bỏ trống").isString().isLength({ min: 1 }),
    check("addressDetail", "Địa chỉ chi tiết không được bỏ trống").isString().isLength({ min: 1 }),
    check("size", "Diện tích không được bỏ trống").isString().isLength({ min: 1 }),
    check("bedroom", "Số phòng ngủ không được bỏ trống").isString().isLength({ min: 1 }),
    check("bathroom", "Số phòng tắm không được bỏ trống").isString().isLength({ min: 1 }),
    check("isPrivate", "Chung chủ không được bỏ trống").isString().isLength({ min: 1 }),
    check("kitchenDetail", "Phòng bếp không được bỏ trống").isString().isLength({ min: 1 }),
    check("price").custom(val => {
        if (val.length === 0) {
            throw new Error("Giá không được bỏ trống")
        }
        if (isNaN(parseInt(val))) {
            throw new Error("Giá phải là chữ số")
        }
        return true;
    }),
    check("electricPrice").custom(val => {
        if (val.length === 0) {
            throw new Error("Tiền điện không được bỏ trống")
        }
        if (isNaN(parseInt(val))) {
            throw new Error("Tiền điện phải là chữ số")
        }
        return true;
    }),
    check("waterPrice").custom(val => {
        if (val.length === 0) {
            throw new Error("Tiền nước không được bỏ trống")
        }
        if (isNaN(parseInt(val))) {
            throw new Error("Tiền nước phải là chữ số")
        }
        return true;
    }),
    // check("title", "Tiêu đề không được bỏ trống").isString().isLength({ min: 1 }),

], async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const errors = validationResult(req);
    console.log(req.body.price, typeof req.body.price)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorMessage: errors.array()[0].msg, errorType: errors.array()[0].param }).end();
    }
    let user = await User.findById(decodedToken.id)
    let typeAccount = user.typeAccount;
    if (req.files && req.files.length < 3) {
        return res.status(400).send({ errorMessage: "Cần ít nhất 3 ảnh", errorType: "image" })
    } else {
        let arrImagePath = [];
        req.files.forEach(el => {
            arrImagePath.push("/images/" + el.filename)
        })
        let realEstate = new RealEstate({
            ...req.body,
            imagePath: arrImagePath,
            status: "Chưa được cho thuê",
            userId: decodedToken.id,
            isApprove: typeAccount === Config.MEMBER_ACCOUNT ? false : true,
            createTime: new Date().getTime()
        })
        await realEstate.save()
        return res.status(200).send("success").end()
    }
})
realEstateRouter.post("/get-property", async (req, res) => {
    let id = req.body.id;
    let userId
    let realEstate = (await RealEstate.findById(id)).toJSON();
    let user = await User.findById(realEstate.userId);
    if (realEstate) {
        return res.status(200).send({
            ...realEstate,
            phone: user.phone,
            fullname: user.firstName + " " + user.lastName
        }).end()
    }
    return res.status(400).end()
})
realEstateRouter.post("/for-fake-data", (req, res) => {
    console.log(req.body);
    console.log("xxx", req.files)
    if (req.files.length > 0) {
        req.files.forEach(async (el) => {
            console.log(req.files)
            let food = new RealEstate({
                ...req.body,
                imagePath: "/images/" + el.filename
            })
            await food.save()
        })

        return res.status(200).send(`success`).end();
    }
    // let realState = new RealState
    res.status(401).end()
})
realEstateRouter.post("/get-list-not-approve", async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    let user = await User.findById(decodedToken.id)
    let typeAccount = user.typeAccount;
    if (typeAccount === Config.ADMIN_ACCOUNT) {
        let realEstates = await RealEstate.find({ isApprove: Config.WAIT_APPROVE })
        return res.status(200).json(realEstates).end()
    }
    return res.status(400).send("Bạn không có quyền truy cập").end()
})
realEstateRouter.post("/search-property", async (req, res) => {
    console.log(req.body);
    let body = { ...req.body };
    let query = {}
    let price
    for (let item in body) {
        if (body[item] && item !== "size") {
            query = {
                ...query,
                [item]: body[item]
            }
        }
    }
    if (query.price) {
        price = parseInt(query.price) * 1000000;
    }
    let minSize = 0;
    let maxSize;
    if (req.body.size) {
        let temp = req.body.size;
        if (temp.search("-") === -1) {
            minSize = 50;
        } else {
            minSize = parseInt(temp.substring(3, 5));
            maxSize = parseInt(temp.substring(8, 10))
        }
        console.log("xxx ", minSize, maxSize)
    }
    console.log("xxx", query)
    let listRealEstates = await RealEstate.find({ ...query, isApprove: Config.APPROVED, price: price ? { $gte: price } : { $gte: 0 }, size: maxSize ? { $gte: minSize, $lte: maxSize } : { $gte: minSize } })
    if (listRealEstates) {
        console.log("xxx listRealEstates", listRealEstates)
        return res.status(200).json(listRealEstates).end()
    }
    return res.status(400).end()
})
module.exports = realEstateRouter