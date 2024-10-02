import { Navigate, Route, Routes } from "react-router";
import { useDrawerContext } from "../shared/contexts";
import { useEffect, useState } from "react";
import {
    DashBoard,
    DetalheUsuario,
    ListagemUsuarios,
    DetalheEmpresa,
    ListaEmpresas,
} from "../pages";
import { Cardapio } from "../pages/cardapio/cardapio";
import { MapaMesas } from "../pages/mapamesa/MapaMesas";
import { ListaGrupos } from "../pages/grupo/ListaGrupos";
import { DetalheGrupo } from "../pages/grupo/DetalheGrupo";
import { ListaProdutos } from "../pages/produto/ListaProdutos";
import { DetalheProduto } from "../pages/produto/DetalheProduto";

export const AppRoutes = () => {
    const { toggleDrawerOpen, setDrawerOptions } = useDrawerContext()

    useEffect(() => {
        setDrawerOptions([
            {
                icon: "home",
                label: "DashBoard",
                path: "/dashboard"
            },
            {
                icon: "factory",
                label: "Empresas",
                path: "/empresas"
            },
            {
                icon: "person",
                label: "Usuarios",
                path: "/usuarios"
            },
            {
                icon: "category",
                label: "Grupos",
                path: "/grupos"
            },
            {
                icon: "fastfood",
                label: "Produtos",
                path: "/produtos"
            },
            {
                icon: "menu_book",
                label: "Cardapio Card",
                path: "/cardapio"
            },
            {
                icon: "location_on",
                label: "Mapa de Mesas",
                path: "/mapamesa"
            }]);

    }, []);

    return (
        <Routes>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/empresas" element={<ListaEmpresas />} />
            <Route path="/empresas/detalhe/:id" element={<DetalheEmpresa />} />
            <Route path="/usuarios" element={<ListagemUsuarios />} />
            <Route path="/usuarios/detalhe/:id" element={<DetalheUsuario />} />
            <Route path="/grupos" element={<ListaGrupos />} />
            <Route path="/grupos/detalhe/:id" element={<DetalheGrupo />} />
            <Route path="/produtos" element={<ListaProdutos />} />
            <Route path="/produtos/detalhe/:id" element={<DetalheProduto />} />
            <Route path="/mapamesa" element={<MapaMesas />} />

            {<Route path="*" element={<Navigate to="/dashboard" />} />}
        </Routes>
    );
}