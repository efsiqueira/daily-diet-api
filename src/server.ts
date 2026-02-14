import fastify from "fastify"
import { mealsRoutes } from "./routes/meals"
import { usersRoutes } from "./routes/users"

const app = fastify()

app.register(usersRoutes, {
  prefix: "/users",
})
app.register(mealsRoutes, {
  prefix: "/meals",
})

app.listen({
  port: 3333
})
  .then(() => {
    console.log("HTTP Server Running!")
  })