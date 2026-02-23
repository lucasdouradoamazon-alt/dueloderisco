# 📱 Como Abrir no Celular

## 🚀 Método Rápido

### 1. Descubra o IP do seu PC
Abra o **Prompt de Comando** (CMD) e digite:
```cmd
ipconfig
```

Procure por **"Endereço IPv4"** - vai ser algo como:
- `192.168.1.100`
- `192.168.0.50`
- `10.0.0.5`

### 2. Execute o servidor corretamente
Pare o servidor atual (Ctrl+C) e rode:
```bash
npm run dev:host
```

Ou crie um arquivo `.env.local` na raiz do projeto com:
```env
HOST=0.0.0.0
```

### 3. Acesse no celular
No navegador do celular, digite:
```
http://192.168.1.100:3000
```
(Substitua pelo seu IP)

---

## ⚠️ Requisitos Importantes

1. **Mesmo WiFi**: Celular e PC devem estar na mesma rede WiFi
2. **Firewall**: Pode precisar desativar temporariamente
3. **Antivírus**: Alguns bloqueiam conexões externas

---

## 🔧 Solução de Problemas

### "Não carrega" / "Site não encontrado"
- ✅ Verifique se o IP está correto
- ✅ Confirme que celular e PC estão no mesmo WiFi
- ✅ Tente desligar o firewall do Windows
- ✅ Reinicie o roteador

### "Só funciona no PC"
- ✅ Use `npm run dev:host` em vez de `npm run dev`
- ✅ Verifique se não há outro programa usando porta 3000

### "Não sei meu IP"
No CMD, procure a linha:
```
Endereço IPv4. . . . . . . .  : 192.168.1.xxx
```

---

## 💡 Alternativa: Hotspot do Celular

Se nada funcionar:
1. Ative o hotspot do celular
2. Conecte o PC no WiFi do celular
3. Descubra o novo IP do PC
4. Acesse normalmente

---

## 🖥️ Alternativa: Simular no PC

Pressione **F12** no Chrome → Clique no ícone 📱 → Escolha iPhone/Android

Assim você testa a interface mobile sem precisar do celular!
