# Ideas: Game with use of Websocket server and clients

We can create a type json which info about STATUS, it has the DATA, and the user name/id.

Example: a user joined: 

```jsonc
{
    "status": "join",
    "username": "Foo",
    "data": "{\"x\":1, \"y\":1, \"color\": \"cornflowerblue\"}" 
}
```

Example: a user left: 

```jsonc
{
    "status": "left",
    "username": "Foo",
    // "data" value won't be required as it wont be used. 
}
```
