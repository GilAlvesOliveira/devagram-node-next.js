import type { NextApiRequest, NextApiResponse } from 'next';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {UsuarioModel} from '../../models/UsuarioModels';
import md5 from 'md5';
import { join } from 'path';
import { json } from 'stream/consumers';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
        if(req.method === 'POST'){
            const {login, senha} = req.body;

            const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
            if(usuariosEncontrados && usuariosEncontrados.length > 0){
                const usuarioEncontrado = usuariosEncontrados[0];
                return res.status(200).json({msg : `Usuario ${usuarioEncontrado.nome} autenticado com sucesso`});
            }

            return res.status(400).json({erro : 'Usuario ou senha nao encontrado'});
        }
        return res.status(405).json({erro: 'Metodo informado e invalido'});
}

export default conectarMongoDB(endpointLogin);