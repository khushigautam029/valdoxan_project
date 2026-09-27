import AccessCode from "./accessCode.js";
import Category from "./category.js";
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

export {
    AccessCode, Category, Device, User
};

