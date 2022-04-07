import express from "express";
import mongoose from "mongoose";
import noteModel from "./models/notes.js"
import cors from "cors"
import dotenv from "dotenv"

const app = express();

dotenv.config()

app.use(express.json());
app.use(cors());



mongoose.connect(process.env.ATLAS_URI)



app.get ("/getNotes", (req,res) =>{
    noteModel.find({},(err, result) =>{
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    })
});

app.post ("/createNote", async (req,res) => {
    const note = req.body;
    const newNote = new noteModel(note);
    await newNote.save();

    res.json(note);
})

app.put("/updateNote", async (req,res) =>{
    const newTitle =req.body.newTitle;
    const id = req.body.id;

    try {
        await noteModel.findById(id, (error,noteToUpdate)=>{
            noteToUpdate.title = newTitle;
            noteToUpdate.save()
        });
    } catch(err){
        console.log(err)
    }
    res.send("updated")
});

app.delete("/deleteNote/:id", async (req, res)=>{
    const id = req.params.id
    await noteModel.findByIdAndRemove(id).exec()
    res.send("note deleted") 
})

app.listen(3001,()=>{
    console.log(`listening on : 3001`)
});