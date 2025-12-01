"use client";
import useAuthStore from "@/context/user/auth-store";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import React, { useEffect, useState } from "react";

const BonoHome: React.FC = () => {
    const { profile } = useAuthStore();

    const [nombre, setNombre] = useState("");
    const [compraMin, setCompraMin] = useState<number | null>(null);
    const [bono, setBono] = useState<number | null>(null);

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!profile) return;

        const storedNombre =
            profile.cliente?.infoCliente?.sNombre || "Consultora";

        let attempts = 0;
        const maxAttempts = 30; // 30 * 400ms = 12 segundos máx

        const intervalId = setInterval(() => {
            attempts++;

            let bonoValue: number | null = null;
            let metaValue: number | null = null;

            // recorrer localStorage completo
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                const raw = localStorage.getItem(key);
                const num = raw ? Number(raw) : NaN;

                if (key.includes("banner_sBono") && !isNaN(num)) {
                    bonoValue = num;
                }

                if (key.includes("banner_sMeta") && !isNaN(num)) {
                    metaValue = num;
                }

                if (bonoValue !== null && metaValue !== null) break;
            }

            // si ya encontró ambos → detenemos
            if (bonoValue !== null && metaValue !== null) {
                setNombre(storedNombre);
                setBono(bonoValue);
                setCompraMin(metaValue);
                clearInterval(intervalId);
            }

            // si pasa mucho tiempo → stop
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
            }

        }, 400);

        return () => clearInterval(intervalId);
    }, [profile]);

    // ❌ No mostrar franja hasta tener ambos valores
    if (bono === null || compraMin === null) return null;

    return (
        <>
            {/* FRANJA */}
            <div
                style={{
                    background: "linear-gradient(90deg, #ff1493 0%, #ff69b4 100%)",
                    color: "#fff",
                    padding: "16px 24px",
                    borderRadius: "8px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "16px 0",
                    flexWrap: "wrap"
                }}
            >
                <span style={{ fontSize: "15px" }}>
                    <b>{nombre}</b>, compra S/{compraMin} a más y gana{" "}
                    <b>Bono Actívate de S/{bono}</b>. 💫
                </span>

                <a
                    onClick={() => setModalOpen(true)}
                    style={{
                        color: "#fff",
                        textDecoration: "underline",
                        fontWeight: 700,
                        marginTop: "8px",
                        width: "100%",
                        cursor: "pointer",
                        textAlign: "right"
                    }}
                >
                    VER CONDICIONES AQUI
                </a>
            </div>

            {/* MODAL */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} placement="center">
                <ModalContent className="min-h-[300px] flex flex-col justify-center">
                    <ModalHeader className="font-bold text-lg text-center">
                        CONDICIONES
                    </ModalHeader>

                    <ModalBody className="pb-4">
                        <ul className="list-disc pl-4 space-y-2">
                            <li>Exclusivo para pedidos desde Smart.</li>
                            <li>No aplica productos de Cybers y preventa.</li>
                            <li>Solo se consideran pedidos confirmados por la directora desde 21 al 30 de noviembre.</li>
                            <li>Podrás usar tu bono actívate al llegar al monto solicitado.</li>
                            <li>Este bono es único y se otorga una sola vez.</li>
                        </ul>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default BonoHome;
