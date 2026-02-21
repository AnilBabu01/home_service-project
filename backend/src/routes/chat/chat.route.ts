import { Router } from "express";
import { getChats, getRoomInfoByRoomId, index, sendMessage } from "../../controllers/chat/chat.controller";
import { isAuthenticateToken } from "../../middlewares/providerAuth";

export const router = Router();

router.get("/rooms", isAuthenticateToken, index);
router.get("/rooms/:roomId", isAuthenticateToken, getRoomInfoByRoomId);
router.post("/", isAuthenticateToken, sendMessage);
router.get("/:roomId", isAuthenticateToken, getChats);
