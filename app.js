const {
    Client,
    Events,
    SectionsBuilder
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");
const {
    createSSHAccount,
    createVlessAccount,
    createTrojanAccount,
    createVmessAccount,
    createShadowsocksAccount
} = require('@fightertunnel/createft');

let config = {
    admin: {
        id: "62882001492789@.whatsapp.net",
        number: "62882001492789"
    },
    bot: {}
};

// Penggunaan usePairingCode
const usePairingCode = false; // Tetapkan true jika Anda ingin menggunakan kode penyandingan
let phoneNumber = null; // Tambahkan nomor ponsel jika menggunakan kode pairing

const bot = new Client({
    prefix: "!",
    phoneNumber: phoneNumber,
    usePairingCode: usePairingCode,
    printQRInTerminal: !usePairingCode,
    WAVersion: [2, 3000, 1015901307],
    selfReply: true
});

bot.ev.once(Events.ClientReady, async (m) => {
    console.log(`[fightertunnel-bot] Bot ready at ${m.user.id}`);
    config.bot.number = m.user.id.split(/[:@]/)[0];
    config.bot.id = config.bot.number + S_WHATSAPP_NET;
});

bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {});

const defaultServer = "Contoh.com:6969"; // Ganti dengan domain dan port api server

bot.command("create", async (ctx) => {
    let sectionBuilder = new SectionsBuilder();
    sectionBuilder.setDisplayText("Pilih layanan");
    ["SSH", "VMESS", "TROJAN", "VLESS", "SHADOWSOCKS"].forEach((service) => {
        sectionBuilder.addSection({
            title: "Layanan",
            rows: [{
                title: `${service}`,
                id: service
            }]
        });
    });

    await ctx.sendInteractiveMessage(ctx.id, {
        body: "Silakan pilih layanan",
        footer: "Pilih layanan untuk melanjutkan",
        nativeFlowMessage: {
            buttons: [sectionBuilder.build()]
        }
    });

    let promptsSSH = [
        "Masukkan nama pengguna (tanpa spasi):",
        "Masukkan kata sandi (min 6 karakter):",
        "Masukkan masa berlaku (format angka):",
        "Masukkan batasan IP (format angka):"
    ];

    let promptsOther = [
        "Masukkan nama pengguna (tanpa spasi):",
        "Masukkan masa berlaku (format angka):",
        "Masukkan kuota (format angka):",
        "Masukkan batasan IP (format angka):"
    ];

    let data = {};
    let currentStep = 0;
    let selectedService;
    let col = ctx.MessageCollector({
        time: 60000
    });

    col.on("collect", async (m) => {
        const content = m.content;

        if (!selectedService) {
            const validServices = ["SSH", "VMESS", "TROJAN", "VLESS", "SHADOWSOCKS"];
            if (validServices.includes(content.toUpperCase())) {
                selectedService = content.toUpperCase();
                await ctx.reply(`${selectedService} dipilih. Silakan masukkan detail berikut.`);
                await ctx.reply(selectedService === "SSH" ? promptsSSH[currentStep] : promptsOther[currentStep]);
            } else {
                await ctx.reply("Layanan tidak valid. Pilih salah satu dari: SSH, VMESS, TROJAN, VLESS, SHADOWSOCKS.");
            }
        } else {
            if (selectedService === "SSH") {
                switch (currentStep) {
                    case 0:
                        if (/\s/.test(content)) return await ctx.reply("Nama pengguna tidak boleh mengandung spasi.");
                        data.username = content;
                        break;
                    case 1:
                        if (content.length < 6) return await ctx.reply("Password minimal harus 6 karakter.");
                        data.password = content;
                        break;
                    case 2:
                        if (!/^\d+$/.test(content)) return await ctx.reply("Masa berlaku harus berupa angka.");
                        if (parseInt(content, 10) > 30) return await ctx.reply("Masa berlaku tidak boleh lebih dari 30 hari.");
                        data.expiry = content;
                        break;
                    case 3:
                        if (!/^\d+$/.test(content)) return await ctx.reply("Batasan IP harus berupa angka.");
                        data.iplimit = content;
                        break;
                }
            } else {
                switch (currentStep) {
                    case 0:
                        if (/\s/.test(content)) return await ctx.reply("Nama pengguna tidak boleh mengandung spasi.");
                        data.username = content;
                        break;
                    case 1:
                        if (!/^\d+$/.test(content)) return await ctx.reply("Masa berlaku harus berupa angka.");
                        if (parseInt(content, 10) > 30) return await ctx.reply("Masa berlaku tidak boleh lebih dari 30 hari.");
                        data.expiry = content;
                        break;
                    case 2:
                        if (!/^\d+$/.test(content)) return await ctx.reply("Kuota harus berupa angka.");
                        data.quota = content;
                        break;
                    case 3:
                        if (!/^\d+$/.test(content)) return await ctx.reply("Batasan IP harus berupa angka.");
                        data.iplimit = content;
                        break;
                }
            }
            currentStep++;
            if (currentStep < (selectedService === "SSH" ? promptsSSH.length : promptsOther.length)) {
                await ctx.reply(selectedService === "SSH" ? promptsSSH[currentStep] : promptsOther[currentStep]);
            } else {
                col.stop();
            }
        }
    });

    let interactionEnded = false;

    col.on("end", async () => {
        if (!interactionEnded) {
            interactionEnded = true;
            if (!selectedService) {
                await ctx.reply("Proses dihentikan. Layanan tidak dipilih.");
            } else if (currentStep < (selectedService === "SSH" ? promptsSSH.length : promptsOther.length)) {
                await ctx.reply("Proses dihentikan sebelum semua data terkumpul.");
            } else {
                if (selectedService === "VMESS") {
                    await createVmessAccount(defaultServer, data, ctx);
                } else if (selectedService === "TROJAN") {
                    await createTrojanAccount(defaultServer, data, ctx);
                } else if (selectedService === "VLESS") {
                    await createVlessAccount(defaultServer, data, ctx);
                } else if (selectedService === "SHADOWSOCKS") {
                    await createShadowsocksAccount(defaultServer, data, ctx);
                } else if (selectedService === "SSH") {
                    await createSSHAccount(defaultServer, data, ctx);
                }
            }
            console.log(`[fightertunnel-bot] Interaction ended.`);
        }
    });
});

bot.launch().catch((error) => console.error("[fightertunnel-bot] Error:", error));
