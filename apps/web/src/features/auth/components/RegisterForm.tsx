
'use client'

import { useState } from 'react'

export function RegisterForm() {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Datos enviados (${mode}):`, formData)
  }

  return (
    <section id="registro" className="w-full bg-black py-20 px-4 border-t border-zinc-900">
      <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
        
        {/* Cabecera ACCESS con pestañas LOGIN / REGISTER */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase font-sans">
            ACCESS
          </h2>
          <div className="flex gap-4 text-xs font-bold tracking-widest">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`transition-colors uppercase pb-1 ${
                mode === 'login'
                  ? 'text-amber-500 border-b-2 border-amber-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`transition-colors uppercase pb-1 ${
                mode === 'register'
                  ? 'text-amber-500 border-b-2 border-amber-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              REGISTER
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
                NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="J. DOE"
                className="w-full p-3 bg-black border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@brooklynfast.com"
              className="w-full p-3 bg-black border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full p-3 bg-black border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black tracking-widest text-lg uppercase transition-colors"
          >
            {mode === 'register' ? 'ENTER' : 'ENTER'}
          </button>
        </form>
      </div>
    </section>
  )
}