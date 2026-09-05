<div align="center">
  <img src="https://files.catbox.moe/w2n7qa.jpg" width="180">

  <h1>Baileys Velyxen</h1>
  <p><strong>Build Better • Connect Faster • Stay Stable</strong></p>

[![npm version](https://img.shields.io/npm/v/velyxen.svg)](https://www.npmjs.com/package/velyxen)
[![License](https://img.shields.io/badge/license-GPL%203-blue.svg)](LICENSE)
[![Downloads](https://img.shields.io/npm/dm/velyxen.svg)](https://www.npmjs.com/package/velyxen)
</div>

<div align="center">
  <strong>Velyxen</strong> — WhatsApp API Multi‑Device Modern untuk bot dan aplikasi berbasis Node.js.
</div>

---

## ✨ Fitur Utama

- 🚀 **Modern & Cepat** – Dibangun dengan TypeScript dan teknologi terkini.
- 🔧 **Perbaikan @lid & @jid** – Mengatasi masalah ID lokal ke ID ponsel di grup WhatsApp.
- 📱 **Dukungan Multi‑Device** – Koneksi penuh ke WhatsApp Multi‑Device.
- 🔐 **Enkripsi End‑to‑End** – Semua pesan terenkripsi.
- 📨 **Semua Jenis Pesan** – Teks, media (gambar, video, audio), polling, stiker, lokasi, kontak, dan lainnya.
- 🧩 **Ringan & Optimal** – Performa stabil dengan dukungan streaming media.
- 📂 **Manajemen Autentikasi** – Simpan kredensial di file atau database.

---

## ⚠️ Peringatan

Proyek ini **tidak berafiliasi, didukung, atau terhubung secara resmi** dengan WhatsApp atau anak perusahaannya. Situs resmi WhatsApp: [whatsapp.com](https://whatsapp.com).

Pengguna bertanggung jawab penuh atas penggunaan aplikasi ini. Hindari spam dan otomatisasi berlebihan yang melanggar Ketentuan Layanan WhatsApp.

---

## 📦 Instalasi

### Versi Stabil (Direkomendasikan)

```bash
npm install velyxen
```

Versi Terbaru (Edge)

```bash
npm install velyxen@latest
# atau dengan yarn
yarn add velyxen@latest
```

Cara Impor

```javascript
// CommonJS
const { default: makeWASocket } = require("velyxen")

// ES6 Module
import makeWASocket from "velyxen"
```

---

🚀 Mulai Cepat

Contoh Dasar (dengan QR Code)

```javascript
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('velyxen')
const { Boom } = require('@hapi/boom')

async function connectToWhatsApp() {
    // Simpan kredensial di folder 'auth_info_velyxen'
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_velyxen')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['Velyxen', 'Desktop', '3.0']
    })

    // Event koneksi
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Koneksi tertutup, reconnecting:', shouldReconnect)
            if (shouldReconnect) connectToWhatsApp()
        } else if (connection === 'open') {
            console.log('✅ Berhasil terhubung ke WhatsApp!')
        }
    })

    // Event pesan masuk
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const m of messages) {
            if (!m.message) continue
            console.log('📱 Pesan baru:', JSON.stringify(m, undefined, 2))
            
            // Balas otomatis
            await sock.sendMessage(m.key.remoteJid!, { 
                text: 'Halo! Saya bot WhatsApp menggunakan velyxen 🤖' 
            })
        }
    })

    // Simpan kredensial saat diperbarui
    sock.ev.on('creds.update', saveCreds)
}

connectToWhatsApp()
```

---

🔌 Koneksi Akun

WhatsApp menyediakan API multi‑device yang memungkinkan velyxen terautentikasi sebagai klien WhatsApp sekunder melalui QR code atau pairing code.

Hubungkan dengan QR Code

```javascript
const { default: makeWASocket, Browsers } = require("velyxen")

const sock = makeWASocket({
    browser: Browsers.ubuntu('My App'),
    printQRInTerminal: true
})
```

Setelah koneksi berhasil, QR code akan muncul di terminal. Pindai dengan WhatsApp di ponsel Anda untuk login.

Hubungkan dengan Pairing Code

Penting: Pairing code memungkinkan koneksi tanpa QR code. Nomor telepon harus tanpa +, (), atau -, dan sertakan kode negara.

```javascript
const { default: makeWASocket } = require("velyxen")

const sock = makeWASocket({
    printQRInTerminal: false
})

// Pairing normal
if (!sock.authState.creds.registered) {
    const number = '6285134816783' // ganti dengan nomor Anda
    const code = await sock.requestPairingCode(number)
    console.log('🔑 Kode Pairing:', code)
}

// Pairing dengan kode kustom (8 karakter)
if (!sock.authState.creds.registered) {
    const pair = "VELYXENX"
    const number = '6285162783999'
    const code = await sock.requestPairingCode(number, pair)
    console.log('🔑 Kode Pairing Kustom:', code)
}
```

Terima Riwayat Lengkap

Untuk menerima riwayat pesan lengkap, setel syncFullHistory ke true.

```javascript
const { default: makeWASocket, Browsers } = require("velyxen")

const sock = makeWASocket({
    browser: Browsers.macOS('Desktop'),
    syncFullHistory: true
})
```

---

⚙️ Catatan Penting Konfigurasi Socket

Caching Metadata Grup (Direkomendasikan)

Untuk penggunaan grup, implementasikan caching metadata grup:

```javascript
const { default: makeWASocket } = require("velyxen")
const NodeCache = require('node-cache')

const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false })

const sock = makeWASocket({
    cachedGroupMetadata: async (jid) => groupCache.get(jid)
})

sock.ev.on('groups.update', async ([event]) => {
    const metadata = await sock.groupMetadata(event.id)
    groupCache.set(event.id, metadata)
})

sock.ev.on('group-participants.update', async (event) => {
    const metadata = await sock.groupMetadata(event.id)
    groupCache.set(event.id, metadata)
})
```

Perbaiki Sistem Retry & Dekripsi Vote Poll

Tingkatkan pengiriman pesan dan dekripsi vote poll dengan store:

```javascript
const sock = makeWASocket({
    getMessage: async (key) => await getMessageFromStore(key)
})
```

Terima Notifikasi di Aplikasi WhatsApp

Nonaktifkan status online untuk menerima notifikasi:

```javascript
const sock = makeWASocket({
    markOnlineOnConnect: false
})
```

---

💾 Simpan Info Auth

Hindari pemindaian QR code berulang dengan menyimpan kredensial:

```javascript
const { default: makeWASocket, useMultiFileAuthState } = require("velyxen")

async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_velyxen')
    const sock = makeWASocket({ auth: state })
    sock.ev.on('creds.update', saveCreds)
}

connect()
```

Penting: useMultiFileAuthState menyimpan status auth di folder. Untuk produksi, gunakan database SQL/No‑SQL dan kelola update kunci dengan hati‑hati.

---

🗄️ Implementasi Data Store

velyxen tidak menyertakan penyimpanan default untuk obrolan, kontak, atau pesan. Namun, implementasi in‑memory sederhana disediakan.

```javascript
const { default: makeWASocket, makeInMemoryStore } = require("velyxen")

const store = makeInMemoryStore({ })

store.readFromFile('./velyxen_store.json')

setInterval(() => {
    store.writeToFile('./velyxen_store.json')
}, 10_000)

const sock = makeWASocket({ })
store.bind(sock.ev)

sock.ev.on('chats.upsert', () => {
    console.log('dapat obrolan', store.chats.all())
})

sock.ev.on('contacts.upsert', () => {
    console.log('dapat kontak', Object.values(store.contacts))
})
```

---

🆔 Penjelasan ID WhatsApp

id adalah ID WhatsApp, disebut juga jid, untuk orang atau grup tujuan pesan.

· Orang: [kode negara][nomor telepon]@s.whatsapp.net
    Contoh: +19999999999@s.whatsapp.net
· Grup: 123456789-123345@g.us
· Daftar siaran: [timestamp pembuatan]@broadcast
· Cerita: status@broadcast

---

🔧 Fungsi Utilitas

· getContentType – Mengembalikan tipe konten pesan
· getDevice – Mengembalikan perangkat dari pesan
· makeCacheableSignalKeyStore – Mempercepat store auth
· downloadContentFromMessage – Unduh konten dari pesan

---

📤 Kirim Pesan

Kirim semua jenis pesan dengan satu fungsi.

```javascript
sock.sendMessage(jid, content, options)
```

Pesan Non‑Media

Pesan Teks

```javascript
await sock.sendMessage(jid, { text: 'halo dunia' })
```

Pesan Kutipan (bekerja dengan semua tipe)

```javascript
await sock.sendMessage(jid, { text: 'halo dunia' }, { quoted: message })
```

Sebut Pengguna

```javascript
await sock.sendMessage(
    jid,
    {
        text: '@12345678901',
        mentions: ['12345678901@s.whatsapp.net']
    }
)
```

Teruskan Pesan

```javascript
const msg = getMessageFromStore() // implementasikan sendiri
await sock.sendMessage(jid, { forward: msg })
```

Pesan Lokasi

```javascript
await sock.sendMessage(
    jid, 
    {
        location: {
            degreesLatitude: 24.121231,
            degreesLongitude: 55.1121221
        }
    }
)
```

Pesan Kontak (vCard)

```javascript
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:Jeff Singh\n' 
            + 'ORG:Ashoka Uni;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' 
            + 'END:VCARD'

await sock.sendMessage(
    id,
    { 
        contacts: { 
            displayName: 'Jeff', 
            contacts: [{ vcard }] 
        }
    }
)
```

Pesan Reaksi

```javascript
await sock.sendMessage(
    jid,
    {
        react: {
            text: '💖', // kosongkan untuk hapus reaksi
            key: message.key
        }
    }
)
```

Pin Pesan

```javascript
await sock.sendMessage(
    jid,
    {
        pin: {
            type: 1, // 0 untuk hapus
            time: 86400, // 24 jam dalam detik
            key: message.key
        }
    }
)
```

Pesan Poll

```javascript
await sock.sendMessage(
    jid,
    {
        poll: {
            name: 'Poll Saya',
            values: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
            selectableCount: 1,
            toAnnouncementGroup: false
        }
    }
)
```

Kirim dengan Pratinjau Tautan

Instal link-preview-js:

```bash
npm install link-preview-js
```

```javascript
await sock.sendMessage(
    jid,
    {
        text: 'Halo, ini dikirim menggunakan https://npmjs.com/velyxen'
    }
)
```

Pesan Media

Catatan: Di pesan media, bisa gunakan { stream: Stream }, { url: Url }, atau Buffer langsung.

Kirim Gambar

```javascript
await sock.sendMessage(
    id, 
    { 
        image: {
            url: './Media/ma_img.png'
        },
        caption: 'halo dunia'
    }
)
```

Kirim Video

```javascript
await sock.sendMessage(
    id, 
    { 
        video: {
            url: './Media/ma_video.mp4'
        },
        caption: 'halo dunia',
        ptv: false // true untuk video note
    }
)
```

Kirim GIF

```javascript
await sock.sendMessage(
    jid, 
    { 
        video: fs.readFileSync('Media/ma_gif.mp4'),
        caption: 'halo dunia',
        gifPlayback: true
    }
)
```

Kirim Audio

```javascript
await sock.sendMessage(
    jid, 
    {
        audio: {
            url: './Media/audio.mp3'
        },
        mimetype: 'audio/mp4'
    }
)
```

View Once

```javascript
await sock.sendMessage(
    id, 
    { 
        image: {
            url: './Media/ma_img.png'
        },
        viewOnce: true,
        caption: 'halo dunia'
    }
)
```

---

✏️ Ubah Pesan

Hapus Pesan (untuk semua)

```javascript
const msg = await sock.sendMessage(jid, { text: 'halo dunia' })
await sock.sendMessage(jid, { delete: msg.key })
```

Edit Pesan

```javascript
await sock.sendMessage(jid, {
    text: 'teks terupdate di sini',
    edit: response.key,
})
```

---

🖼️ Manipulasi Pesan Media

Unduh Pesan Media

```javascript
import { createWriteStream } from 'fs'
import { downloadMediaMessage, getContentType } from 'velyxen'

sock.ev.on('messages.upsert', async ({ messages: [m] }) => {
    if (!m.message) return
    const messageType = getContentType(m)

    if (messageType === 'imageMessage') {
        const stream = await downloadMediaMessage(
            m,
            'stream',
            { },
            { 
                logger,
                reuploadRequest: sock.updateMediaMessage
            }
        )
        const writeStream = createWriteStream('./my-download.jpeg')
        stream.pipe(writeStream)
    }
})
```

---

📞 Tolak Panggilan

```javascript
await sock.rejectCall(callId, callFrom)
```

---

💬 Status Kirim di Obrolan

Baca Pesan

```javascript
await sock.readMessages([key]) // bisa multiple kunci
```

Update Kehadiran

```javascript
await sock.sendPresenceUpdate('available', jid) 
await sock.sendPresenceUpdate('composing', jid)
```

---

📁 Ubah Obrolan

Arsipkan Obrolan

```javascript
const lastMsgInChat = await getLastMessageInChat(jid) // implementasikan sendiri
await sock.chatModify({ archive: true, lastMessages: [lastMsgInChat] }, jid)
```

Bisukan/Buka Bisukan Obrolan

```javascript
// Bisukan 8 jam
await sock.chatModify({ mute: 8 * 60 * 60 * 1000 }, jid)
// Buka bisukan
await sock.chatModify({ mute: null }, jid)
```

Tandai Obrolan Dibaca/Tidak Dibaca

```javascript
const lastMsgInChat = await getLastMessageInChat(jid)
await sock.chatModify({ markRead: false, lastMessages: [lastMsgInChat] }, jid)
```

Hapus Pesan untuk Saya

```javascript
await sock.chatModify(
    {
        clear: {
            messages: [
                {
                    id: 'ATWYHDNNWU81732J',
                    fromMe: true, 
                    timestamp: '1654823909'
                }
            ]
        }
    }, 
    jid
)
```

Hapus Obrolan

```javascript
const lastMsgInChat = await getLastMessageInChat(jid)
await sock.chatModify({
    delete: true,
    lastMessages: [
        {
            key: lastMsgInChat.key,
            messageTimestamp: lastMsgInChat.messageTimestamp
        }
    ]
}, jid)
```

Pin/Hapus Pin Obrolan

```javascript
await sock.chatModify({ pin: true }, jid)   // pin
await sock.chatModify({ pin: false }, jid) // hapus pin
```

Bintangi/Hapus Bintang Pesan

```javascript
await sock.chatModify({
    star: {
        messages: [
            {
                id: 'messageID',
                fromMe: true
            }
        ],
        star: true // atau false untuk hapus bintang
    }
}, jid)
```

Pesan Menghilang

```javascript
// Nyalakan pesan menghilang (7 hari default)
await sock.sendMessage(
    jid, 
    { disappearingMessagesInChat: 604800 } // 7 hari dalam detik
)

// Kirim sebagai pesan menghilang
await sock.sendMessage(jid, { text: 'halo' }, { ephemeralExpiration: 604800 })

// Matikan
await sock.sendMessage(
    jid, 
    { disappearingMessagesInChat: false }
)
```

---

👤 Query Pengguna

Periksa ID Ada di WhatsApp

```javascript
const [result] = await sock.onWhatsApp(jid)
if (result.exists) console.log(`${jid} ada di WhatsApp, sebagai jid: ${result.jid}`)
```

Query Riwayat Obrolan

```javascript
const msg = await getOldestMessageInChat(jid) // implementasikan sendiri
await sock.fetchMessageHistory(
    50, // jumlah (max: 50 per query)
    msg.key,
    msg.messageTimestamp
)
```

Ambil Status

```javascript
const status = await sock.fetchStatus(jid)
console.log('status: ' + status)
```

Ambil Foto Profil (grup juga)

```javascript
// resolusi rendah
const ppUrl = await sock.profilePictureUrl(jid)
console.log(ppUrl)

// resolusi tinggi
const ppUrlHigh = await sock.profilePictureUrl(jid, 'image')
```

Ambil Profil Bisnis

```javascript
const profile = await sock.getBusinessProfile(jid)
console.log('deskripsi: ' + profile.description + ', kategori: ' + profile.category)
```

Ambil Kehadiran Seseorang

```javascript
sock.ev.on('presence.update', console.log)
await sock.presenceSubscribe(jid) 
```

---

🔄 Ubah Profil

Ubah Status Profil

```javascript
await sock.updateProfileStatus('Halo Dunia!')
```

Ubah Nama Profil

```javascript
await sock.updateProfileName('Nama Saya')
```

Ubah Foto Tampilan (grup juga)

```javascript
await sock.updateProfilePicture(jid, { url: './new-profile-picture.jpeg' })
```

Hapus Foto Tampilan (grup juga)

```javascript
await sock.removeProfilePicture(jid)
```

---

👥 Grup

Buat Grup

```javascript
const group = await sock.groupCreate('Grup Saya', ['1234@s.whatsapp.net', '4564@s.whatsapp.net'])
console.log('grup dibuat dengan id: ' + group.gid)
```

Tambah/Hapus atau Turunkan/Naikkan

```javascript
await sock.groupParticipantsUpdate(
    jid, 
    ['abcd@s.whatsapp.net', 'efgh@s.whatsapp.net'],
    'add' // 'remove', 'demote', atau 'promote'
)
```

Ubah Subjek (nama)

```javascript
await sock.groupUpdateSubject(jid, 'Subjek Baru!')
```

Ubah Deskripsi

```javascript
await sock.groupUpdateDescription(jid, 'Deskripsi Baru!')
```

Ubah Pengaturan

```javascript
// Hanya admin kirim pesan
await sock.groupSettingUpdate(jid, 'announcement')
// Semua bisa kirim
await sock.groupSettingUpdate(jid, 'not_announcement')
// Semua bisa ubah pengaturan grup
await sock.groupSettingUpdate(jid, 'unlocked')
// Hanya admin ubah pengaturan
await sock.groupSettingUpdate(jid, 'locked')
```

Keluar Grup

```javascript
await sock.groupLeave(jid)
```

Ambil Kode Undangan

```javascript
const code = await sock.groupInviteCode(jid)
console.log('https://chat.whatsapp.com/' + code)
```

Cabut Kode Undangan

```javascript
const code = await sock.groupRevokeInvite(jid)
console.log('Kode grup baru: ' + code)
```

Gabung Menggunakan Kode Undangan

```javascript
const response = await sock.groupAcceptInvite(code)
console.log('bergabung ke: ' + response)
```

Ambil Info Grup dari Kode Undangan

```javascript
const response = await sock.groupGetInviteInfo(code)
console.log('info grup: ' + response)
```

Query Metadata

```javascript
const metadata = await sock.groupMetadata(jid) 
console.log(metadata.id + ', judul: ' + metadata.subject + ', deskripsi: ' + metadata.desc)
```

Ambil Semua Metadata Grup yang Diikuti

```javascript
const response = await sock.groupFetchAllParticipating()
console.log(response)
```

Toggle Ephemeral

```javascript
await sock.groupToggleEphemeral(jid, 86400) // 24 jam
```

Ubah Mode Tambah

```javascript
await sock.groupMemberAddMode(
    jid,
    'all_member_add' // atau 'admin_add'
)
```

---

🔒 Privasi

Blokir/Buka Blokir Pengguna

```javascript
await sock.updateBlockStatus(jid, 'block')
await sock.updateBlockStatus(jid, 'unblock')
```

Ambil Pengaturan Privasi

```javascript
const privacySettings = await sock.fetchPrivacySettings(true)
console.log(privacySettings)
```

Ambil Daftar Blokir

```javascript
const blocklist = await sock.fetchBlocklist()
console.log(blocklist)
```

Update Privasi

```javascript
await sock.updateLastSeenPrivacy('contacts')
await sock.updateOnlinePrivacy('all')
await sock.updateProfilePicturePrivacy('contacts')
await sock.updateStatusPrivacy('none')
await sock.updateReadReceiptsPrivacy('all')
await sock.updateGroupsAddPrivacy('contacts')
await sock.updateDefaultDisappearingMode(86400) // 24 jam
```

---

📢 Daftar Siaran & Cerita

Kirim Siaran & Cerita

```javascript
await sock.sendMessage(
    jid,
    {
        image: {
            url: url
        },
        caption: caption
    },
    {
        backgroundColor: backgroundColor,
        font: font,
        statusJidList: statusJidList,
        broadcast: true
    }
)
```

Query Penerima & Nama Daftar Siaran

```javascript
const bList = await sock.getBroadcastListInfo('1234@broadcast')
console.log(`nama daftar: ${bList.name}, penerima: ${bList.recipients}`)
```

---

🛠️ Fungsi Kustom

Aktifkan Level Debug

```javascript
const { P } = require('velyxen')

const sock = makeWASocket({
    logger: P({ level: 'debug' }),
})
```

Daftarkan Callback untuk Event Websocket

```javascript
// Untuk tag 'edge_routing'
sock.ws.on('CB:edge_routing', (node) => { })

// Dengan id 'abcd'
sock.ws.on('CB:edge_routing,id:abcd', (node) => { })

// Dengan node routing_info
sock.ws.on('CB:edge_routing,id:abcd,routing_info', (node) => { })
```

---

💡 Tips & Praktik Terbaik

· Gunakan Caching – Cache metadata grup untuk performa lebih baik.
· Tangani Rekoneksi – Implementasikan auto‑reconnect untuk kestabilan.
· Kelola Store – Gunakan database (MongoDB, PostgreSQL) untuk produksi.
· Penanganan Error – Bungkus panggilan socket dengan try‑catch.
· Batas Rate – Hormati batas WhatsApp untuk hindari ban.
· Keamanan – Jangan bagikan kredensial auth; gunakan variabel lingkungan.

---

📄 Lisensi

Didistribusikan di bawah Lisensi GPL‑3.0. Lihat file LICENSE untuk informasi lebih lanjut.

---
<div align="center">
  <strong>Velyxen</strong> — velyxen<br>
  WhatsApp API Modern dengan Perbaikan @lid Ke @pn
</div>
