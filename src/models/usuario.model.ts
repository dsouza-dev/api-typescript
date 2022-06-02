import { model, Schema, Document } from "mongoose";
import { UsuarioInterface } from "../interfaces/usuario.interfaces";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

interface UsuarioModel extends UsuarioInterface, Document {
    compararSenhas(senha: string): Promise<Boolean>;
    gerarToken(): string;
}

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    }
});

UsuarioSchema.pre<UsuarioModel>("save", async function criptografarSenha() {
    this.senha = await bcrypt.hash(this.senha, 8);
});

UsuarioSchema.pre<UsuarioModel>("save", function gerarAvatar() {
    const randomId = Math.floor(Math.random() * (1000000)) + 1;
    this.avatar = `api.lorem.space/image/face?w=150&h=150`
})

UsuarioSchema.methods.compararSenhas = function (senha: string): Promise<Boolean> {
    return bcrypt.compare(senha, this.senha);
}

UsuarioSchema.methods.gerarToken = function (): string {
    const decodedToken = {
        _id: String(this._id),
        nome: this.nome,
        avatar: this.avatar
    };

    return jwt.sign(decodedToken, 'SECRET', {
        expiresIn: '1d'
    });
}

export default model<UsuarioModel>('Usuario', UsuarioSchema);