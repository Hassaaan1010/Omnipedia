// import routers
import registerRouter from "./register.js";
import loginRouter from "./login.js";
import logoutRouter from "./logout.js";
import homeRouter from "./home.js";
import usersRouter from "./users.js";
import foldersRouter from "./folders.js";
import postsRouter from "./posts.js";
import subjectsRouter from "./subjects.js";
import topicsRouter from "./topics.js";
import omnipostsRouter from "./omniposts.js";

const routerNode = (app) => {
  app.use("/login", loginRouter);
  app.use("/logout", logoutRouter);
  app.use("/register", registerRouter);
  app.use("/home", homeRouter);
  app.use("/users", usersRouter);
  app.use("/folders", foldersRouter);
  app.use("/posts", postsRouter);
  app.use("/omniposts", omnipostsRouter);
  app.use("/subjects", subjectsRouter);
  app.use("/topics", topicsRouter);

  // if user is logged in, /login will redirect to home
  app.use("*", (req, res) => {
    res.redirect("/login");
  });
};

export default routerNode;
