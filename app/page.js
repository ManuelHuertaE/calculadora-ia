"use client";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function Calculadora() {
  const [modeloActual, setModeloActual] = useState(null);
  const [operacion, setOperacion] = useState("suma");
  const [valA, setValA] = useState("");
  const [valB, setValB] = useState("");
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    async function cargarModelo() {
      setModeloActual(null);
      setResultado(null);

      const path =
        operacion === "suma"
          ? "/modelo_suma/model.json"
          : "/modelo_resta/model.json";

      try {
        const m = await tf.loadLayersModel(path);
        setModeloActual(m);
      } catch (err) {
        console.error("Error cargando modelo:", err);
      }
    }

    cargarModelo();
  }, [operacion]);

  const calcular = async () => {
    if (!modeloActual || valA === "" || valB === "") return;

    const input = tf.tensor2d([[parseFloat(valA), parseFloat(valB)]]);
    const prediccion = modeloActual.predict(input);
    const data = await prediccion.data();

    setResultado(data[0].toFixed(2));

    input.dispose();
    prediccion.dispose();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="bg-[#1E293B] p-10 rounded-xl shadow-xl max-w-md w-full border border-white/10">

        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-2">
          Calculadora Neuronal
        </h1>
        <p className="text-center text-gray-300 text-sm mb-4">
          Modelo de Deep Learning corriendo en tu navegador
        </p>

        {/* Estado */}
        <p className="text-center text-green-400 font-semibold mb-6">
          {modeloActual ? "IA Lista para usar 🚀" : "Cargando modelo..."}
        </p>

        {/* Selector de operación */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setOperacion("suma")}
            className={`flex-1 py-2 rounded-lg transition ${
              operacion === "suma"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Suma (+)
          </button>

          <button
            onClick={() => setOperacion("resta")}
            className={`flex-1 py-2 rounded-lg transition ${
              operacion === "resta"
                ? "bg-red-500 text-white shadow"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Resta (–)
          </button>
        </div>

        {/* Inputs */}
        <label className="text-gray-200 mb-1 block">Número A</label>
        <input
          type="number"
          value={valA}
          onChange={(e) => setValA(e.target.value)}
          placeholder="Ingresa un valor..."
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 mb-4 outline-none border border-gray-600 focus:border-blue-400"
        />

        <label className="text-gray-200 mb-1 block">Número B</label>
        <input
          type="number"
          value={valB}
          onChange={(e) => setValB(e.target.value)}
          placeholder="Ingresa un valor..."
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 mb-6 outline-none border border-gray-600 focus:border-blue-400"
        />

        {/* Botón */}
        <button
          onClick={calcular}
          disabled={!modeloActual}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg disabled:bg-gray-600"
        >
          {modeloActual ? "Calcular con IA" : "Cargando Modelo..."}
        </button>

        {/* Resultado */}
        {resultado && (
          <div className="mt-6 p-4 rounded-lg bg-gray-800 text-center border border-gray-700">
            <p className="text-gray-300 text-sm">Resultado:</p>
            <p className="text-3xl font-bold text-white mt-1">{resultado}</p>
          </div>
        )}
      </div>
    </div>
  );
}
