function distance(ne, old, speed) {
  dis =
    ((ne[0] - old[0]) ** 2 + (ne[1] - old[1]) ** 2 + (ne[2] - old[2]) ** 2) **
    0.5;
  return dis / 100 / speed;
}
function time(code) {
  row = 0;
  time_min = 0;
  time_min2 = 0;
  speed = 0;
  speed2 = 0;
  min_z = 999999;
  hoge = code.split("\n");
  for (let line of hoge) {
    if (row == 3) {
      xyz_old = line.slice(7, line.length - 2).split(",");
      row += 1;
    } else {
      if (line == "") {
        break;
      } else if (line[0] == "Z") {
        xyz_new = line
          .slice(2, line.length - 2)
          .split(",")
          .map((x) => parseFloat(x));
        min_z = Math.min(min_z, xyz_new[2]);
        time_min += distance(xyz_new, xyz_old, speed);
        time_min2 += distance(xyz_new, xyz_old, speed2);
        xyz_old = xyz_new;
      } else if (line[0] == "V") {
        line = line
          .slice(2, line.length - 2)
          .replaceAll(";", "")
          .replaceAll("F", "");
        two = line.split(" ").map((x) => parseFloat(x));
        if (two[0] != 0) {
          speed = two[0] * 60;
          speed2 = two[0] * 60 * 2;
        } else if (two[0] == 0) {
          speed = 6;
          speed2 = speed;
        }
      }
      row += 1;
    }
  }
  time_min = Math.ceil(time_min);
  time_day = Math.floor(time_min / 60 / 24);
  time_hour = Math.floor((time_min / 60) % 24);
  time_min = time_min % 60;
  time_send =
    "推定加工時間: (100%) " +
    (time_day > 0 ? time_day.toString() + "日 " : "") +
    (time_day > 0 || time_hour > 0 ? time_hour.toString() + "時間 " : "") +
    time_min.toString() +
    "分";
  time_min2 = Math.ceil(time_min2);
  time_day2 = Math.floor(time_min2 / 60 / 24);
  time_hour2 = Math.floor((time_min2 / 60) % 24);
  time_min2 = time_min2 % 60;
  time_send +=
    " (200%) " +
    (time_day2 > 0 ? time_day2.toString() + "日 " : "") +
    (time_day2 > 0 || time_hour2 > 0 ? time_hour2.toString() + "時間 " : "") +
    time_min2.toString() +
    "分";
  if (min_z / 100 < -1) {
    //z座標が台より下まで行く場合警告する
    time_send += " <b>材の上面が原点です</b>";
  }
  return time_send;
}
async function loadPrn() {
  const file = document.getElementById("file-prn").files[0];
  const code = await file.text();
  const time_send = time(code);
  document.getElementById("output-prn").innerHTML = time_send;
}
