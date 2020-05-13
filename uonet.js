let rokPocz, miesiacPocz, dzienPocz, rokKon, miesiacKon, dzienKon

exports.getDataPoczatkowa = function (rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany) {
    if (dzienWybrany - (dzienTygWybrany - 1) < 0 && miesiacWybrany - 1 > 0) { //-3
        rokPocz = rokWybrany
        miesiacPocz = miesiacWybrany - 1
        dzienPocz = new Date(rokWybrany, miesiacWybrany - 1, 0).getDate() + (dzienWybrany - (dzienTygWybrany - 1))
        console.log("\n1 if pocz")
    } else if (dzienWybrany - (dzienTygWybrany - 1) < 0 && miesiacWybrany - 1 <= 0) {
        rokPocz = rokWybrany - 1
        miesiacPocz = 12
        dzienPocz = 31 + (dzienWybrany - (dzienTygWybrany - 1))
        console.log("\n2 if pocz")
    } else {
        rokPocz = rokWybrany
        miesiacPocz = miesiacWybrany
        dzienPocz = dzienWybrany - (dzienTygWybrany - 1)
        console.log("\n3 if pocz")
    }
    if (miesiacPocz < 10) miesiacPocz = "0" + miesiacPocz
    if (dzienPocz < 10) dzienPocz = "0" + dzienPocz
    return rokPocz + "-" + miesiacPocz + "-" + dzienPocz
}

exports.getDataKoncowa = function (rokWybrany, miesiacWybrany, dzienWybrany, dzienTygWybrany) {
    if (parseInt(dzienWybrany) + (7 - dzienTygWybrany) > new Date(rokWybrany, miesiacWybrany, 0).getDate() && miesiacWybrany < 12) {
        rokKon = rokWybrany
        miesiacKon = 1 + parseInt(miesiacWybrany)
        dzienKon = (7 - dzienTygWybrany) - (new Date(rokWybrany, miesiacWybrany, 0).getDate() - dzienWybrany)
        console.log(`1 if kon`)
    } else if (dzienWybrany + (7 - dzienTygWybrany) > new Date(rokWybrany, miesiacWybrany, 0).getDate() && miesiacWybrany >= 12) {
        rokKon = rokWybrany + 1
        miesiacKon = 1
        dzienKon = (7 - dzienTygWybrany) - (new Date(rokWybrany, miesiacWybrany, 0).getDate() - dzienWybrany)
        console.log("2 if kon")
    } else {
        rokKon = rokWybrany
        miesiacKon = miesiacWybrany
        dzienKon = parseInt(dzienWybrany) + (7 - dzienTygWybrany)
        console.log("3 if kon")
    }
    if (miesiacKon < 10) miesiacKon = "0" + miesiacKon
    if (dzienKon < 10) dzienKon = "0" + dzienKon
    return rokKon + "-" + miesiacKon + "-" + dzienKon
}
