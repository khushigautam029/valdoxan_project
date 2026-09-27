import AccessCode from "./accessCode.js";
import Category from "./category.js";
import Content from "./content.js";
import Device from "./device.js";
import User from "./user.js";


AccessCode.hasMany(Device, {
    foreignKey: "accessCodeId",
    as: "devices",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Device.belongsTo(AccessCode, {
    foreignKey: "accessCodeId",
    as: "accessCode"
});


Category.hasMany(Content, {
    foreignKey: "categoryId",
    as: "contents",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Content.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category"
});


export {
    AccessCode, Category,
    Content, Device, User
};
