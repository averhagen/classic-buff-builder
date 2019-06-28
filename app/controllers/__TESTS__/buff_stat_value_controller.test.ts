import { BuffModel, BuffDocument } from "../../models/buff";
import { statModel, StatDocument } from "../../models/stat";
import { BuffStatValue, BuffStatValueDocument } from "../../models/buff_stat_value";
import { startConnectionToTestDB, stopConnectionToTestDB } from "../../test_utils/connection_utils";
import { BuffStatValueController } from "../buff_stat_value_controller";

beforeAll(startConnectionToTestDB);
afterAll(stopConnectionToTestDB);

test("addNewBuffStatValue method creates the correct buffStatValue.", async () => {
    const buffValues = {
        name: "buff_stat_value buff name test",
        rank: 0
    }

    const statValues = {
        name: "buff_stat_value controller test mock stat name",
    }

    const buffDoc = await new BuffModel(buffValues).save();
    const statDoc = await new statModel(statValues).save();

    const req: any = {
        body: {
            buff: buffDoc._id,
            stat: statDoc._id,
            value: 20
        }
    }

    const res: any = {
        json: jest.fn(),
        send: jest.fn()
    }

    await new BuffStatValueController().addNewBuffStatValue(req, res);

    expect(res.json).toBeCalled();
});

test("getBuffStatValue method returns the correct BuffStatValue with the correct params.", async () => {

    const timeSeed = Date.now();

    // Create and save fake buff data.
    const mockBuffDocuments: BuffDocument[] = [];
    for (let i = 0; i < 10; i++) {
        const mockBuffName: String = "getBuffStatValue mock buff name " + timeSeed + i;
        for (let j = 0; j < 5; j++) {
            mockBuffDocuments.push(await new BuffModel({ name: mockBuffName, rank: j }).save());
        }
    }

    //Create and save fake stat data.
    const mockStatDocuments: StatDocument[] = [];
    for (let i = 0; i < 10; i++) {
        const mockBuffName: String = "getBuffStatValue mock stat name " + timeSeed + i;
        mockStatDocuments.push(await new statModel({ name: mockBuffName }).save());
    }

    //Create and save mock BuffStatValue documents
    const mockBuffStatValueDocuments: BuffStatValueDocument[] = [];
    for (let i = 0; i < mockBuffDocuments.length; i++) {
        for (let j = 0; j < mockStatDocuments.length; j++) {
            const buffStatValueValues = {
                buff: mockBuffDocuments[i]._id,
                stat: mockStatDocuments[j]._id,
                value: Math.floor(Math.random() * 50)
            };
            const savedBuffStatValue = await new BuffStatValue(buffStatValueValues).save();
            mockBuffStatValueDocuments.push(savedBuffStatValue);
        }
    }

    const randomIndex = Math.floor(Math.random() * mockBuffStatValueDocuments.length);
    const selectedBuffStatValueDoc = mockBuffStatValueDocuments[randomIndex];

    const buffStatValueController = new BuffStatValueController();

    const req: any = {
        body: {
            buff: selectedBuffStatValueDoc.buff,
            stat: selectedBuffStatValueDoc.stat
        }
    }

    const resMockJsonFunction = jest.fn();

    const res: any = {
        json: resMockJsonFunction,
        send: jest.fn()
    }

    await buffStatValueController.getBuffStatValue(req, res);

    expect(resMockJsonFunction).toBeCalledWith(selectedBuffStatValueDoc.toJSON());
});