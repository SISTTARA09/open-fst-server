import type express from "express";
function profileController(req: express.Request, res: express.Response) {
	res.status(200).json({ user: req.user });
}

export { profileController };
