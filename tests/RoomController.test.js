const RoomController = require('../src/Controllers/RoomController');
const RoomValidator = require('../src/Validators/RoomValidator');

describe('RoomController.createRoom', () => {
   let controller;
   let mockRoomService; 
   let mockReq;
   let mockRes; 

   beforeEach(() => {
    mockRoomService = {createRoom : jest.fn()}
    controller = new RoomController(mockRoomService);
    mockReq =  {body: {playersNum: 4, maxScore: 20 }}; 
    mockRes = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn()
    }
    })

    test('return 400 if validation fails', () => {
        jest.spyOn(RoomValidator, 'validateCreateRoomBody').mockReturnValue(['playersNum missing']);
        controller.createRoom(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({errors:['playersNum missing']});

    }) 

    test('create a room and return valid room id', () => {
        jest.spyOn(RoomValidator, 'validateCreateRoomBody').mockReturnValue([]);
        mockRoomService.createRoom.mockReturnValue('Room123');
        controller.createRoom(mockReq, mockRes); 
        expect(mockRoomService.createRoom).toHaveBeenCalledWith(4, 20); 
        expect(mockRes.json).toHaveBeenCalledWith({roomId: "Room123"})
    })
})