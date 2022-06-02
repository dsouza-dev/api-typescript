import { Request, Response } from "express";
import usuarioModel from "../models/usuario.model"


class UsuarioController {

    public async cadastrar(req: Request, res: Response): Promise<Response> {
        const usuario = await usuarioModel.create(req.body);
        const resposta = {
            message: "Usuário cadastrado com sucesso!",
            _id: usuario._id,
            nome: usuario.nome,
        }
        return res.json(resposta);
    }

    public async autenticar(req: Request, res: Response): Promise<Response> {
        const { nome, senha } = req.body;
        const usuario = await usuarioModel.findOne({ nome: nome });
        if (!usuario) {
            return res.status(400).send({ message: 'Usuário não encontrado' });
        }
        const senhaValida = await usuario.compararSenhas(senha);
        if (!senhaValida) {
            return res.status(400).send({ message: 'Senha incorreta' });
        }

        return res.json({
            usuario,
            token: usuario.gerarToken()
        });

    }

}

export default new UsuarioController();