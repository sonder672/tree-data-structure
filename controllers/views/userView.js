const loginView = (req, res) => {
    res.render('login');
};

const registerView = (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(404).redirect('404');
    }

    res.render('register', { userId });
}

module.exports = { loginView, registerView };