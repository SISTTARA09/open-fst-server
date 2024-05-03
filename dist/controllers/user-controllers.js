function profileController(req, res) {
    res.status(200).json({ user: req.user });
}
export { profileController };
