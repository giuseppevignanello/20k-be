
class RoomValidator {
validateCreateRoomBody(body) {
    const errors = [];

    if (!body.playersNum) {
        errors.push("Missing 'playersNum' in body");
    }

    if (!body.maxScore) {
        errors.push("Missing 'maxScore' in body");
    }

    return errors;
}
    
}

module.exports = new RoomValidator();