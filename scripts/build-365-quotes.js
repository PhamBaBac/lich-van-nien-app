// scripts/build-365-quotes.js
// Script tạo danh mục 365 câu ca dao, tục ngữ, danh tác văn học Việt Nam cho 365 ngày không trùng lặp

const fs = require('fs');
const path = require('path');

const quotes = [
  // =========================================================================
  // NHÓM 1: CÔNG CHA NGHĨA MẸ & ĐẠO LÀM CON (1 - 55)
  // =========================================================================
  {
    content: "Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra. Một lòng thờ mẹ kính cha, cho tròn chữ hiếu mới là đạo con.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đố ai đếm được lá rừng, đố ai đếm được mấy tầng trời cao. Đố ai đếm được vì sao, đố ai đếm được công lao mẹ già.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đi khắp thế gian không ai tốt bằng mẹ, gánh nặng cuộc đời không ai khổ bằng cha.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nước biển mênh mông không đong đầy tình mẹ, mây trời lồng lộng không phủ kín công cha.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ già như chuối ba hương, như xôi nếp một, như đường mía lau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Ơn cha nặng lắm ai ơi, nghĩa mẹ bằng trời mang nặng đẻ đau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Con người có cố có ông, như cây có cội như sông có nguồn.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cây xanh thì lá cũng xanh, cha mẹ hiền lành để đức cho con.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Ngồi buồn nhớ mẹ ta xưa, miệng nhai cơm búng, lưỡi lừa cá xương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ cha gánh vác gian nan, nuôi con khôn lớn muôn vàn tình thâm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Còn cha gót đỏ như son, đến khi cha mất gót con đen sì.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nuôi con chẳng quản chi công, mong con khôn lớn thỏa lòng mẹ cha.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Công cha như núi ngất trời, nghĩa mẹ như nước ở ngoài biển Đông.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Ai về thăm mẹ chiều nay, cho con gửi chút lòng này nhớ thương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ nuôi con biển hồ lai láng, con nuôi mẹ tính tháng kể ngày.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Công cha đức mẹ cao dày, cưu mang trứng nước những ngày ngây thơ.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Vạn hạt mưa rơi không hạt nào nhầm chỗ, muôn người gặp gỡ không người nào ngẫu nhiên.",
    author: "Dân gian Việt Nam"
  },
  {
    content: "Trời cao biển rộng bao la, làm sao sánh đặng tình cha mẹ hiền.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Lên non mới biết non cao, nuôi con mới biết công lao mẹ hiền.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gió mùa thu mẹ ru con ngủ, năm canh chày thức đủ vừa năm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ già một nắng hai sương, chắt chiu từng giọt yêu thương nuôi mình.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thờ cha mẹ ở hết lòng, ấy là chữ hiếu rạng dòng tổ tông.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đêm đêm thắp ngọn đèn trời, cầu cho cha mẹ sống đời với con.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Dù đi trăm suối ngàn khe, công ơn cha mẹ chẳng hề nhạt phai.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Chim trời ai dễ đếm lông, nuôi con ai dễ kể công tháng ngày.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đói lòng ăn đọt chà là, để cơm nuôi mẹ mẹ già yếu răng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ hiền dạy dỗ sớm hôm, khuyên con giữ dạ thảo thơm một lòng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thương cha tần tảo sớm hôm, sớm khuya gánh nặng vun bòn cho con.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Lòng mẹ rộng lớn bao la, chở che bóng mát mái nhà ấm êm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Ai còn mẹ xin đừng làm mẹ khóc, đừng để buồn lên mắt mẹ nghe không.",
    author: "Thơ Việt Nam"
  },
  {
    content: "Công cha ngút ngát trời mây, tình thương của mẹ đêm ngày khắc sâu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ thương con bằng trời bằng bể, cha thương con bằng núi bằng non.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nhớ ơn chín chữ cù lao, ba năm nhũ bộ biết bao ân tình.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ như dòng suối ngọt ngào, ru con êm giấc dạt dào yêu thương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mỗi bước đời con bước đi, đều in dấu bóng dáng vì mẹ cha.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ ru tiếng hát ngọt lành, cho con giấc ngủ tròn vành tuổi thơ.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Có cha có mẹ thì hơn, không cha không mẹ như đờn đứt dây.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đờn đứt dây còn mong nối lại, cha mẹ mất rồi biết tại nơi đâu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Muốn cho gần mẹ gần cha, khi vào thưa gửi, khi ra chào mời.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cơm người khổ lắm ai ơi, chẳng như cơm mẹ vừa ngồi vừa ăn.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Được mùa dưa thương mẹ, được mùa lúa thương cha.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Ăn quả nhớ kẻ trồng cây, có danh có phận nhớ thầy khi xưa.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chim có tổ, người có tông, như cây có cội, như sông có nguồn.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ nuôi con bằng sữa ngọt ngào, cha nuôi con bằng mồ hôi nước mắt.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Chữ hiếu niệm niệm trong lòng, dẫu ngàn gian khổ quản công tháng ngày.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Mẹ là ngọn đuốc soi đường, cha là bóng mát yêu thương chở che.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Sống sao cho vẹn tình thâm, đáp đền ơn nghĩa ngàn năm sinh thành.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Bát cơm mẹ xới dẻo thơm, chan chứa giọt mồ hôi sớm trưa tảo tần.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Dù mai khôn lớn thành danh, lòng con ghi khắc ân tình mẹ cha.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Bàn tay mẹ dịu dàng nâng bước, lời cha dạy vững chãi tương lai.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Con đi muôn dặm nẻo đường, bóng cha hình mẹ luôn thường bên tâm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thân mẫu khổ nhọc trăm bề, mong sao con trẻ trọn bề bình an.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nghĩa mẹ sâu tợ trùng dương, công cha vững chãi kiên cường núi non.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Chữ hiếu làm đầu muôn hạnh, kính trên nhường dưới vẹn tròn nghĩa nhân.",
    author: "Ca dao Việt Nam"
  },

  // =========================================================================
  // NHÓM 2: GIA ĐÌNH, VỢ CHỒNG, ANH EM & TÌNH THÂN (56 - 105)
  // =========================================================================
  {
    content: "Thuận vợ thuận chồng, tát biển Đông cũng cạn.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Anh em như thể tay chân, rách lành đùm bọc dở hay đỡ đần.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Khôn ngoan đối đáp người ngoài, gà cùng một mẹ chớ hoài đá nhau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Chồng giận thì vợ bớt lời, cơm sôi nhỏ lửa biết đời nào khê.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gia hòa vạn sự hưng, gia đình êm ấm ngàn năm phúc lành.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Râu tôm nấu với ruột bầu, chồng chan vợ húp gật đầu khen ngon.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Có chồng có vợ như đũa có đôi, như thuyền có lái ngược xuôi vững vàng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Một giọt máu đào hơn ao nước lã.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chị ngã em nâng, tương thân tương ái một lòng giúp nhau.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Anh em hòa thuận hai thân vui vầy, trong nhà ấm êm chẳng ngày nào âu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Vợ chồng một dạ sắt son, gian nan chẳng nản, vuông tròn nghĩa nhân.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Qua đình ngả nón trông đình, đình bao nhiêu ngói thương mình bấy nhiêu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Yêu nhau mấy núi cũng trèo, mấy sông cũng lội mấy đèo cũng qua.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thương nhau vạn sự chẳng rời, gian truân thử thách trọn đời bên nhau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Muốn cho trong ấm ngoài êm, nhường nhau một bước cho thêm mặn nồng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tay bưng đĩa muối chén gừng, gừng cay muối mặn xin đừng quên nhau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Anh em cốt nhục tình thâm, đừng vì bạc tiền mà cách biệt nhau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Anh đi em ở lại nhà, việc nhà em liệu việc làng anh lo.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đói no có thiếp có chàng, một manh chiếu rách cũng ngàn tình thương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gia đình là chốn bình yên, xua tan bao nỗi ưu phiền thế gian.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Chồng cày vợ cấy con trâu đi bừa, chăm lo cày cuốc sớm trưa thuận lòng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Vợ khéo vun vén trong nhà, chồng giàu sang bởi vợ mà nên danh.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Trăm năm tình nghĩa vẹn toàn, bạc đầu nghĩa nặng sắc son chẳng sờn.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Anh em bốn bể một nhà, người dưng kính trọng huống là người thân.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Một lòng gìn giữ gia phong, nề nếp gia giáo sáng trong muôn đời.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Vợ chồng chung thủy sắc son, gừng cay muối mặn sắt mòn dạ không.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cắt dây bầu dây bí, ai nỡ cắt dây chị em.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Bán anh em xa mua láng giềng gần, giữ gìn hòa khí muôn phần tốt tươi.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Đèn nhà ai nấy rạng, tình làng nghĩa xóm chớ quên đỡ đần.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Hạt muối cắn đôi, cọng rau bẻ nửa, tình nghĩa bền chặt sớm trưa tối ngày.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Chồng chung sức, vợ đồng lòng, đường xa hóa ngắn núi đồng hóa xuôi.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cây có gốc mới nở cành xanh ngọn, nước có nguồn mới biển rộng sông sâu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gia đình hòa mục cháu con nên người, gia môn phúc ấm rạng ngời mai sau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nhường áo sẻ cơm khi nghèo khó, bên nhau trọn vẹn thuở hàn vi.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tình nghĩa vợ chồng tựa đá tảng, gió lay không chuyển sóng dập không lay.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nói lời giữ lấy chữ tâm, gia đình thuận mục bách niên giai lão.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thương em áo rách em thương, anh đi muôn dặm nẻo đường nhớ quê.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Trăng tròn nhờ bóng hoàng hôn, nhà yên con trẻ lớn khôn nên người.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Lấy chồng gánh vác việc chồng, trọn câu thục hạnh hết lòng chăm lo.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cơm lành canh ngọt gia đình ấm, nụ cười vui vẻ rộn ràng cửa nhà.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Máu chảy ruột mềm, người thân đau đớn dạ mình khôn khuây.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Dâu hiền rể thảo cửa nhà thịnh, cha mẹ an lòng phúc đức sinh.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Lá rụng về cội, nước chảy về nguồn, đi xa trăm nẻo lòng luôn hướng về.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Nhà tranh vách đất mà rộn tiếng cười, còn hơn lầu gác ngậm ngùi lệ rơi.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Anh em chín họ mười đời, còn tình còn nghĩa còn người còn thương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Sống có nghĩa có tình, thủy chung như nhất trước sau một lòng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thuyền trôi nước đẩy xuôi dòng, tình thương gia tộc một lòng sắt son.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tổ ấm bình yên nuôi dưỡng tâm hồn, đi đâu cũng muốn trở về mái xưa.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Thương nhau thì dẫu một quả cà gặm ba, cũng hơn cỗ lớn mà dạ chia xa.",
    author: "Ca dao Việt Nam"
  },

  // =========================================================================
  // NHÓM 3: ĐẠO HỌC, TÔN SƯ TRỌNG ĐẠO & KHỔ LUYỆN THÀNH TÀI (106 - 165)
  // =========================================================================
  {
    content: "Muốn sang thì bắc cầu kiều, muốn con hay chữ thì yêu lấy thầy.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Không thầy đố mày làm nên.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Có công mài sắt, có ngày nên kim.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Học ăn, học nói, học gói, học mở.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Ngọc kia chuốt mãi cũng tròn, sắt kia mài mãi cũng còn nên kim.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Học thầy không tày học bạn.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Đi một ngày đàng, học một sàng khôn.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Học hành vất vả mấy năm, mai sau rạng rỡ vẻ vang gia đường.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Dốt đến đâu học lâu cũng biết.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Văn hay chẳng lọ gối đầu, tay cầm cuốn sách sớm chiều mở mang.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nét chữ nết người, rèn từng nét bút luyện người thanh tao.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Học là học để làm người, biết điều hơn thiệt, biết lời phải chăng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Khuyên con chăm chỉ học hành, mai sau khôn lớn rạng danh tông đường.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nhất tự vi sư, bán tự vi sư. Một chữ cũng thầy, nửa chữ cũng thầy.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Cơm cha áo mẹ chữ thầy, gắng công mà học có ngày rạng danh.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Muốn biết phải hỏi, muốn giỏi phải học.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Đường đi khó không khó vì ngăn sông cách núi, mà khó vì lòng người ngại núi e sông.",
    author: "Nguyễn Bá Học"
  },
  {
    content: "Hiền dữ phải đâu là tính sẵn, phần nhiều do giáo dục mà nên.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Gạo đem vào giã bao đau đớn, gạo giã xong rồi trắng tựa bông. Sống ở trên đời người cũng vậy, gian nan rèn luyện mới thành công.",
    author: "Hồ Chí Minh — Nhật ký trong tù"
  },
  {
    content: "Ví không có cảnh đông tàn, thì đâu có cảnh huy hoàng ngày xuân.",
    author: "Hồ Chí Minh — Nhật ký trong tù"
  },
  {
    content: "Thất bại là mẹ thành công, chớ thấy sóng cả mà ngã tay chèo.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Kiến tha lâu cũng đầy tổ.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Nước chảy đá mòn, kiên tâm bền chí ắt tròn ước mơ.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chớ than phận khó ai ơi, chăm công nghìn việc có trời định phân.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Có chí thì nên, có bền thì đặng.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Dẫu rằng thông minh tấc gang, không chăm học hỏi cũng thành dở dang.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đọc sách trăm lần, nghĩa lý tự khắc tỏ tường.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Trí tuệ mở mang nhờ học vấn, nhân tâm thuần hậu bởi rèn rũa.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Trọng thầy mới được làm thầy, kính nhường tiền bối phúc này bền lâu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Bút nghiên rèn luyện từng ngày, mồ hôi rơi xuống rạng ngời mai sau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Lửa thử vàng, gian nan thử sức, khó khăn tôi luyện người quân tử.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Đường dài mới biết ngựa hay, ở lâu mới biết là người nghĩa nhân.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Dốt nát là bóng đêm, tri thức là ánh sáng soi rọi lối đi.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Chăm làm thì nổi, chăm học thì hay, chớ có lười biếng phung phí tháng ngày.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thua keo này ta bày keo khác, quyết không nản chí chùn chân.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chữ nghĩa là nguồn vốn liếng, trao tặng con thơ báu vật ngàn đời.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Học tập như chèo thuyền ngược nước, không tiến ắt phải lùi.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Biết thì thưa thốt, không biết thì dựa cột mà nghe.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Người không học như ngọc không mài, học rồi ắt tỏ muôn đường sáng soi.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tôn sư trọng đạo nếp nhà, muôn đời ghi khắc ơn cha ơn thầy.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Luyện tài phải luyện cả tâm, tài hoa đi với đức thuần mới lâu.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Trăm nghề lấy chữ làm đầu, dẫu sang hay khó trước sau luyện rèn.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đèn sách đêm thâu nuôi chí lớn, đợi ngày cất cánh vút trời xanh.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gian nan không nản chí, khốn khó chẳng sờn lòng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Khéo ăn thì no, khéo co thì ấm, biết đường học hỏi vạn sự an khang.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chớ cậy thông minh mà lười nhác, rùa kia chậm bước vẫn về đích đầu.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Kính thầy kính bạn mới nên danh, đạo nghĩa muôn đời vẹn tiếng thơm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Muốn leo lên đỉnh núi cao, bước chân khởi điểm từng bờ dốc nghiêng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Sách là ngọn đèn soi lối, tri thức dẫn đường tới vinh quang.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Học rộng, nghĩ sâu, xét việc cẩn thận, nói lời chắc chắn, làm việc hết lòng.",
    author: "Chu Văn An"
  },
  {
    content: "Gươm vàng mài sắc chém gian tà, bút mực rèn tâm giúp quốc gia.",
    author: "Nguyễn Trãi"
  },
  {
    content: "Rèn chí làm trai giữa đất trời, phong ba bão táp chẳng lay dời.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Học không biết chán, dạy không biết mỏi, ấy là cái đức của người thầy.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Tích thiện phùng thiện, chuyên cần ắt hái quả ngọt mai sau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thành công không đến trong chớp mắt, đó là kết tinh của vạn giọt mồ hôi.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Trí tuệ tích lũy từng ngày, như suối nguồn trong chảy mãi không ngừng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nghề nào cũng quý cũng cao, miễn là cần mẫn dạt dào chữ tâm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Khắc cốt ghi tâm lời dạy cũ, bước vào đời với trọn niềm tin.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thong dong học tập sớm chiều, tương lai rạng rỡ bao điều ước mơ.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tài cao mà đức chẳng dày, tựa như cây lớn gió lay tróc cành.",
    author: "Ca dao Việt Nam"
  },

  // =========================================================================
  // NHÓM 4: NHÂN NGHĨA, ĐẠO LÝ LÀM NGƯỜI & LỐI SỐNG LƯƠNG THIỆN (166 - 225)
  // =========================================================================
  {
    content: "Bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một giàn.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nhiễu điều phủ lấy giá gương, người trong một nước phải thương nhau cùng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thương người như thể thương thân.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Lá lành đùm lá rách, lá rách đùm lá nát.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Ở hiền gặp lành, ở ác gặp ác.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Tốt gỗ hơn tốt nước sơn, xấu người đẹp nết còn hơn đẹp người.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Đói cho sạch, rách cho thơm.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Trăm năm bia đá thì mòn, ngàn năm bia miệng vẫn còn trơ trơ.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Kim vàng ai nỡ uốn câu, người khôn ai nỡ nói nhau nặng lời.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Một câu nhịn, chín câu lành.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Cười người chớ vội cười lâu, cười người hôm trước hôm sau người cười.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đất tốt trồng cây rườm rà, những người thanh lịch nói ra dịu dàng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cây ngay không sợ chết đứng.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Thẳng mực tàu đau lòng gỗ, người ngay thẳng không sợ lời thị phi.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Gieo nhân nào gặt quả nấy, gieo gió gặt bão, gieo thiện lành gặt an vui.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Sống đục sao bằng thác trong, thanh danh giữ trọn một lòng sắt son.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thương người người lại thương ta, ghét người người lại hóa ra ghét mình.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Một miếng khi đói bằng một gói khi no.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Cứu một mạng người hơn xây bảy tòa tháp.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Được lòng người là được tất cả, mất lòng người là mất hết cơ duyên.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Nhân từ là cội rễ của phúc đức, khiêm tốn là mẹ đẻ của vinh hoa.",
    author: "Cổ nhân Việt Nam"
  },
  {
    content: "Ăn ngay nói thật mọi tật mọi lành.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Khôn ngoan chẳng lọ thật thà, thật thà là phúc ông bà để cho.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gần mực thì đen, gần đèn thì sáng.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chọn bạn mà chơi, chọn nơi mà ở.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chim khôn hót tiếng rảnh rang, người khôn nói tiếng dịu dàng dễ nghe.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thua một nước cờ chưa hẳn bại, nhường nhau một bước vạn sự an.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Biết người biết ta, trăm trận trăm thắng.",
    author: "Binh pháp dân gian"
  },
  {
    content: "Người có lòng nhân hậu đi đâu cũng được người thương kẻ mến.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Họa từ miệng mà ra, bệnh từ miệng mà vào, cẩn ngôn cẩn hạnh giữ an khang.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Chữ tín quý hơn vàng mười, đánh mất lòng tin muôn đời khó lấy lại.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Nói lời phải giữ lấy lời, đừng như con bướm đậu rồi lại bay.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Vô công bất hưởng lộc, của không do sức mình làm ra chớ ham.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Của phi nghĩa có giàu đâu, ở cho ngay thẳng mai sau vững bền.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Trọng nghĩa khinh tài, quý trọng nhân phẩm hơn vàng bạc châu báu.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Khiêm nhường tựa nước chảy xuôi, thu nạp muôn dòng thành biển mênh mông.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Tâm bình thế giới bình, tâm an vạn sự tự nhiên hanh thông.",
    author: "Thiền ngữ Việt Nam"
  },
  {
    content: "Tha thứ cho người là tạo lối thoát thanh thản cho chính tâm hồn mình.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Gặp người hoạn nạn chớ làm ngơ, giơ tay nâng đỡ bến bờ yêu thương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Ở đời muôn sự của chung, hơn nhau một chữ thủy chung ân tình.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Người khôn ngậm miệng bớt lời, người dại bốc xốc suốt đời truân chuyên.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Hoa thơm nhờ nhụy, người quý nhờ tâm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Ngọc không mài giũa không sáng, người không rèn tâm khó thành bậc hiền tài.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Vui lòng giúp kẻ khó khăn, trời cao có mắt độ trì phúc gia.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Sống đẹp giữa cõi nhân gian, để lại tiếng thơm muôn vàn đời sau.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Nước trong quá thì không có cá, người xét nét quá thì khó có bạn hiền.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Lòng bao dung như dòng sông lớn, dung nạp phù sa nuôi dưỡng đôi bờ.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Ăn quả nhớ kẻ trồng cây, uống nước nhớ nguồn muôn đời tạc dạ.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Biết ơn là ngọn đèn sưởi ấm tâm hồn, thắp sáng đạo lý con người.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Người trồng hoa hoa tỏa hương thơm, người gieo thiện đức phúc ấm ngàn đời.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Khéo léo dung hòa lòng người, biến việc lớn thành nhỏ việc nhỏ thành không.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Chữ tâm sáng tựa vầng trăng, soi rọi nẻo đời muôn vạn nẻo xa.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tâm an thì dẫu lều tranh cũng ấm, tâm loạn thì cung điện cũng lạnh lùng.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Sống thiện lương là phong thủy tốt nhất của đời người.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Được khen chớ vội tự kiêu, bị chê chớ vội buồn rầu buông xuôi.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Lời nói nhã nhặn như gió xuân thoảng mát, lời cay độc như mũi tên bắn vào tim.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Lấy ân báo oán, oán liền tiêu tan; lấy oán báo oán, oán ấy chập chùng.",
    author: "Phật ngữ Việt Nam"
  },
  {
    content: "Người có đức ắt có phúc, người có tài mà vô đức ắt sinh tai họa.",
    author: "Cổ nhân Việt Nam"
  },
  {
    content: "Một ngày sống có ý nghĩa, hơn trăm năm trôi qua hoang phí uổng đời.",
    author: "Danh ngôn Việt Nam"
  },

  // =========================================================================
  // NHÓM 5: DANH TÁC TRUYỆN KIỀU & KIỆT TÁC NGUYỄN DU (226 - 275)
  // =========================================================================
  {
    content: "Thiện căn ở tại lòng ta, chữ tâm kia mới bằng ba chữ tài.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Trăm năm trong cõi người ta, chữ tài chữ mệnh khéo là ghét nhau.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Có tài mà cậy chi tài, chữ tài liền với chữ tai một vần.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Đã mang lấy nghiệp vào thân, cũng đừng trách lẫn trời gần trời xa.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Hoa cười ngọc thốt đoan trang, mây thua nước tóc tuyết nhường màu da.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Làn thu thủy nét xuân sơn, hoa ghen thua thắm liễu hờn kém xanh.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Rập rình lá gió cành chim, sớm đưa tống tạ tối tìm oanh oanh.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Trải qua một cuộc bể dâu, những điều trông thấy mà đau đớn lòng.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Duyên hội ngộ đức cù lao, bên tình bên hiếu bên nào nặng hơn.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Cỏ non xanh tận chân trời, cành lê trắng điểm một vài bông hoa.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Buồn trông cửa bể chiều hôm, thuyền ai thấp thoáng cánh buồm xa xa.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Buồn trông ngọn nước mới sa, hoa trôi man mác biết là về đâu.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Buồn trông nội cỏ rầu rầu, chân mây mặt đất một màu xanh xanh.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Buồn trông gió cuốn mặt duềnh, ầm ầm tiếng sóng kêu quanh ghế ngồi.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Tấm lòng soi sáng bóng gương, dầu dãi sương gió vẫn vương nghĩa tình.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Bắt phong trần phải phong trần, cho thanh cao mới được phần thanh cao.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Chút tình gửi lại non sông, muôn năm bền chặt một lòng thủy chung.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Thương ôi kiếp sống con người, trăm năm ngắn ngủi nụ cười thoáng qua.",
    author: "Nguyễn Du — Văn tế thập loại chúng sinh"
  },
  {
    content: "Kiếp phù sinh như hình bóng bọt, sắc với không muôn lối dập dềnh.",
    author: "Nguyễn Du — Văn tế thập loại chúng sinh"
  },
  {
    content: "Nhờ lượng Phật mở lòng từ tế, rước vong linh về cõi tịnh đài.",
    author: "Nguyễn Du — Văn tế thập loại chúng sinh"
  },
  {
    content: "Cùng trong trời đất sinh ra, phận bèo mặt nước xót xa nỗi niềm.",
    author: "Nguyễn Du — Văn tế thập loại chúng sinh"
  },
  {
    content: "Đoái nhìn muôn dặm cõi trần, tấm lòng nhân ái gửi phần muôn phương.",
    author: "Nguyễn Du"
  },
  {
    content: "Bất tri tam bách dư niên hậu, thiên hạ hà nhân khấp Tố Như? (Chẳng biết ba trăm năm lẻ nữa / Người đời ai khóc Tố Như chăng?)",
    author: "Nguyễn Du — Độc Tiểu Thanh ký"
  },
  {
    content: "Mai cốt cách, tuyết tinh thần, mỗi người một vẻ mười phân vẹn mười.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Gương nga chênh chếch dòm song, vàng gieo ngấn nước cây lồng bóng sân.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Chữ trinh còn một chút này, chẳng duyên chưa dễ vào tay ai cầm.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Dưới đèn sẵn bức tiên hoa, một cành ba bảy đường thơ đậm đà.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Vầng trăng vằng vặc giữa trời, đinh ninh hai miệng một lời song song.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Gìn vàng giữ ngọc cho hay, cho đành lòng kẻ chân mây cuối trời.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Sống sao cho khỏi hổ thẹn với lòng, thác xuống suối vàng dạ chẳng vấn vương.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Tình trong như đã mặt ngoài còn e.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Lấy hiếu làm đầu, quên mình vì chữ phụ mẫu cù lao.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Đoạn trường ai có qua cầu mới hay, cảnh ngộ đau đớn đong đầy lệ rơi.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Trời xanh quen thói má hồng đánh ghen, người hiền dẫu khổ vẫn tròn nghĩa nhân.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Nghìn vàng dễ kiếm, người tri kỷ khó tìm.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Thanh thản đón nhận bão giông, lòng son giữ trọn như dòng nước trong.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Dẫu mòn bia đá nghìn thu, tấm lòng vàng đá dệt câu ân tình.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Người buồn cảnh có vui đâu bao giờ.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Một lời đã trót thốt ra, nghìn vàng khôn chuộc tình xa nghĩa gần.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Cửa Phật thanh tịnh xua tan hờn oán, chuông chùa ngân nga giải tỏa oan khiên.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Giữ tấm lòng son giữa cõi trần, dẫu vùi trong cát vẫn ngời ánh châu.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Hết mưa là nắng hửng lên thôi, qua cơn bĩ cực đến hồi thái lai.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Chữ ân chữ nghĩa nặng tựa thái sơn, người không giữ nghĩa sao nên con người.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Lòng thành thấu tận chín tầng mây xanh, phúc đức gieo mầm nở nụ hoa lành.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Trăm năm một kiếp nhân sinh, sống sao cho trọn nghĩa tình trước sau.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Thuyền quyên dẫu phải phong trần, chữ tâm giữ vững muôn phần sáng trong.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Đèn trăng sáng tỏ đêm trường, tình người sưởi ấm nẻo đường phong ba.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Biết đủ là hạnh phúc lớn nhất trần gian, tham lam là cội nguồn của vạn khổ đau.",
    author: "Nguyễn Du"
  },
  {
    content: "Mong manh một mảnh duyên trời, gặp gỡ trân trọng trọn đời không quên.",
    author: "Nguyễn Du — Truyện Kiều"
  },
  {
    content: "Chân thành là bến đỗ bình yên của mọi tâm hồn.",
    author: "Nguyễn Du"
  },

  // =========================================================================
  // NHÓM 6: THƠ THIỀN LÝ - TRẦN & DANH NHÂN VĂN HÓA VIỆT NAM (276 - 325)
  // =========================================================================
  {
    content: "Xuân đi trăm hoa rụng, xuân đến trăm hoa cười. Trước mắt việc đi mãi, trên đầu già đến rồi. Chớ bảo xuân tàn hoa rụng hết, đêm qua sân trước một cành mai.",
    author: "Thiền sư Mãn Giác — Cáo tật thị chúng"
  },
  {
    content: "Thân như điện ảnh hữu hoàn vô, vạn mộc xuân vinh thu hựu khô. Nhậm vận thịnh suy vô bố úy, thịnh suy như lộ thảo đầu phô.",
    author: "Thiền sư Vạn Hạnh"
  },
  {
    content: "Cư trần lạc đạo thả tùy duyên, cơ tắc xan hề khốn tắc miên. Gia trung hữu bảo hưu tầm mịch, đối cảnh vô tâm mạc vấn thiền.",
    author: "Trần Nhân Tông — Cư trần lạc đạo phú"
  },
  {
    content: "Đem đại nghĩa để thắng hung tàn, lấy chí nhân để thay cường bạo.",
    author: "Nguyễn Trãi — Bình Ngô Đại Cáo"
  },
  {
    content: "Việc nhân nghĩa cốt ở yên dân, quân điếu phạt trước lo trừ bạo.",
    author: "Nguyễn Trãi — Bình Ngô Đại Cáo"
  },
  {
    content: "Ta dại ta tìm nơi vắng vẻ, người khôn người đến chốn lao xao. Thu ăn măng trúc đông ăn giá, xuân tắm hồ sen hạ tắm ao.",
    author: "Nguyễn Bỉnh Khiêm — Nhàn"
  },
  {
    content: "Rượu đến cội cây ta sẽ uống, nhìn xem phú quý tựa chiêm bao.",
    author: "Nguyễn Bỉnh Khiêm — Nhàn"
  },
  {
    content: "Thấy mặt hoa sen nở nước trong, thân mình dẫu dính bùn đen lấm, hương ngát bay xa vẫn sạch trong.",
    author: "Nguyễn Trãi"
  },
  {
    content: "Lòng son một tấc vì dân nước, đêm ngày cuồn cuộn tựa dòng Đông.",
    author: "Nguyễn Trãi — Ức Trai thi tập"
  },
  {
    content: "Bui một tấc lòng ưu ái cũ, đêm ngày cuồn cuộn nước triều Đông.",
    author: "Nguyễn Trãi — Thuật hứng"
  },
  {
    content: "Trúc mai bạn cũ tình bằng hữu, gió mát trăng thanh thú tuyệt vời.",
    author: "Nguyễn Trãi"
  },
  {
    content: "Ở bầu thì tròn, ở ống thì dài, giữ tâm thanh tịnh chẳng màng thị phi.",
    author: "Nguyễn Bỉnh Khiêm"
  },
  {
    content: "Làm người phải có khí tiết, đứng vững giữa đời tựa tùng bách trong sương tuyết.",
    author: "Cao Bá Quát"
  },
  {
    content: "Nhất sinh đê thủ bái hoa mai (Một đời chỉ cúi đầu trước hoa mai cao khiết).",
    author: "Cao Bá Quát"
  },
  {
    content: "Bước tới Đèo Ngang bóng xế tà, cỏ cây chen đá lá chen hoa. Lom khom dưới núi tiều vài chú, lác đác bên sông chợ mấy nhà.",
    author: "Bà Huyện Thanh Quan — Qua Đèo Ngang"
  },
  {
    content: "Nhớ nước đau lòng con quốc quốc, thương nhà mỏi miệng cái gia gia. Dừng chân đứng lại trời non nước, một mảnh tình riêng ta với ta.",
    author: "Bà Huyện Thanh Quan — Qua Đèo Ngang"
  },
  {
    content: "Trời thu xanh ngắt mấy tầng cao, cần trúc lơ phơ gió hắt hiu.",
    author: "Nguyễn Khuyến — Thu vịnh"
  },
  {
    content: "Ao thu lạnh lẽo nước trong veo, một chiếc thuyền câu bé tẻo teo.",
    author: "Nguyễn Khuyến — Thu điếu"
  },
  {
    content: "Lục Vân Tiên cứu Kiều Nguyệt Nga: Nhớ câu kiến nghĩa bất vi, làm người thế ấy cũng phi anh hùng.",
    author: "Nguyễn Đình Chiểu — Lục Vân Tiên"
  },
  {
    content: "Chở bao nhiêu đạo thuyền không khẳm, đâm mấy thằng gian bút chẳng tà.",
    author: "Nguyễn Đình Chiểu"
  },
  {
    content: "Sống làm sao cho tròn nghĩa khí, thác xuống suối vàng dạ chẳng hổ thẹn với lương tâm.",
    author: "Nguyễn Đình Chiểu — Văn tế nghĩa sĩ Cần Giuộc"
  },
  {
    content: "Non sông gấm vóc ngàn năm rạng rỡ, bàn tay cha ông dựng xây bờ cõi kiên cường.",
    author: "Nguyễn Trãi"
  },
  {
    content: "Thà đui mà giữ đạo nhà, còn hơn có mắt ngóng trông bạo tàn.",
    author: "Nguyễn Đình Chiểu"
  },
  {
    content: "Một lòng vì nước vì dân, gian khổ hy sinh quyết chẳng từ nan.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Không có gì quý hơn độc lập, tự do.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Cần, kiệm, liêm, chính, chí công vô tư.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Đạo đức là gốc của người cách mạng, người tài không có đức là người vô dụng.",
    author: "Hồ Chí Minh"
  },
  {
    content: "Trăng vào cửa sổ đòi thơ, việc quân đang bận xin chờ hôm sau.",
    author: "Hồ Chí Minh — Cảnh khuya"
  },
  {
    content: "Tiếng suối trong như tiếng hát xa, trăng lồng cổ thụ bóng lồng hoa.",
    author: "Hồ Chí Minh — Cảnh khuya"
  },
  {
    content: "Cảnh khuya như vẽ người chưa ngủ, chưa ngủ vì lo nỗi nước nhà.",
    author: "Hồ Chí Minh — Cảnh khuya"
  },
  {
    content: "Gặp cảnh gian nan tâm chớ loạn, giữ lòng kiên định vượt trùng khơi.",
    author: "Chu Văn An"
  },
  {
    content: "Cơm áo gạo tiền vương vấn kiếp, thanh bần lạc đạo ấm tình quê.",
    author: "Nguyễn Bỉnh Khiêm"
  },
  {
    content: "Trăm năm một kiếp phù du, danh thơm để lại ngàn thu chẳng mờ.",
    author: "Nguyễn Trãi"
  },
  {
    content: "Sen tàn cúc lại nở hoa, sầu dài ngày ngắn đông đà sang xuân.",
    author: "Nguyễn Du"
  },
  {
    content: "Thong dong dạo gót vườn xưa, lắng nghe tiếng gió thoảng đưa hương trầm.",
    author: "Thiền ngữ Việt Nam"
  },
  {
    content: "Rũ sạch bụi trần tâm sáng tỏ, an nhiên tự tại giữa nhân gian.",
    author: "Thiền phái Trúc Lâm"
  },
  {
    content: "Vạn pháp quy tâm, tâm an thì cảnh giới nào cũng an nhiên tự tại.",
    author: "Thiền phái Trúc Lâm"
  },
  {
    content: "Nguyện đem thân này phụng sự nhân sinh, lấy niềm vui của muôn loài làm niềm vui của mình.",
    author: "Phật giáo Việt Nam"
  },
  {
    content: "Nước chảy mây trôi trần thế mộng, giữ lòng thanh tịnh sáng trăng rằm.",
    author: "Thiền sư Việt Nam"
  },
  {
    content: "Chí làm trai dặm nghìn da ngựa, gánh sơn hà nặng trĩu trên vai.",
    author: "Phan Bội Châu"
  },
  {
    content: "Dậy! Dậy! Dậy! Hỡi quốc dân đồng bào! Nước nhà hưng thịnh cậy vào chúng ta.",
    author: "Phan Bội Châu"
  },
  {
    content: "Xưa nay hào kiệt đất Việt Nam, chẳng chịu cúi đầu trước bạo tàn.",
    author: "Lý Thường Kiệt"
  },
  {
    content: "Nam quốc sơn hà Nam đế cư, tiệt nhiên định phận tại thiên thư. Như hà nghịch lỗ lai xâm phạm, nhữ đẳng hành khan thủ bại hư.",
    author: "Lý Thường Kiệt — Nam quốc sơn hà"
  },
  {
    content: "Sông núi nước Nam vua Nam ở, rành rành định phận tại sách trời. Cớ sao lũ giặc sang xâm phạm, chúng bay sẽ bị đánh tơi bời.",
    author: "Bản dịch Nam quốc sơn hà"
  },
  {
    content: "Ta thà làm quỷ nước Nam, chứ không thèm làm vương đất Bắc.",
    author: "Trần Bình Trọng"
  },
  {
    content: "Nếu bệ hạ muốn hàng, xin hãy chém đầu thần trước đã.",
    author: "Trần Hưng Đạo"
  },
  {
    content: "Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước.",
    author: "Trần Hưng Đạo"
  },

  // =========================================================================
  // NHÓM 7: CA DAO LAO ĐỘNG, QUÊ HƯƠNG ĐẤT NƯỚC & NHÂN SINH AN YÊN (326 - 365)
  // =========================================================================
  {
    content: "Ai ơi bưng bát cơm đầy, dẻo thơm một hạt đắng cay muôn phần.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Cày đồng đang buổi ban trưa, mồ hôi thánh thót như mưa ruộng cày.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Rủ nhau đi cấy đi cày, bây giờ khó nhọc có ngày phong lưu.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tấc đất tấc vàng, mỗi hạt thóc ngọc chứa ngàn mồ hôi.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Đường về xứ Huế quanh quanh, non xanh nước biếc như tranh họa đồ.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Hà Nội ba mươi sáu phố phường, hàng Bồ, hàng Bạc, hàng Gai, hàng Buồm...",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ canh gà Thọ Xương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đồng Đăng có phố Kỳ Lừa, có nàng Tô Thị, có chùa Tam Thanh.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Quê hương mỗi người chỉ một, như là chỉ một mẹ thôi. Quê hương nếu ai không nhớ, sẽ không lớn nổi thành người.",
    author: "Đỗ Trung Quân"
  },
  {
    content: "Việt Nam đất nước ta ơi, mênh mông biển lúa đâu trời đẹp hơn.",
    author: "Nguyễn Đình Thi"
  },
  {
    content: "Cánh cò bay lả rập rờn, mây mờ che đỉnh Trường Sơn sớm chiều.",
    author: "Nguyễn Đình Thi"
  },
  {
    content: "Dù ai buôn bán trăm bề, nhớ ngày giỗ tết tìm về cố hương.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Làng tôi có lũy tre xanh, có dòng sông nhỏ uốn quanh ruộng đồng.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Thương nhau mấy núi cũng trèo, mấy sông cũng lội mấy đèo cũng qua.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đêm trăng thanh gió mát trăng thanh, thảnh thơi dạo bước an lành sớm hôm.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Trời cao lồng lộng gió đưa, cây xanh bóng mát giữa trưa nắng hè.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Lao động là vinh quang, bàn tay ta làm nên tất cả, có sức người sỏi đá cũng thành cơm.",
    author: "Hoàng Trung Thông"
  },
  {
    content: "Ăn no ngủ kỹ tâm hồn thảnh thơi, ấy là đại phúc của đời con người.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Biết đủ là giàu, biết an là thọ, biết buông bỏ là tự do thanh thản.",
    author: "Thiền ngữ Việt Nam"
  },
  {
    content: "Một nụ cười bằng mười thang thuốc bổ, sống vui sống khỏe yêu đời an nhiên.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Sống đơn giản cho đời thanh thản, bớt mong cầu ắt bớt lo toan.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Trời sinh voi trời sinh cỏ, giữ lòng tin tưởng ắt có lối đi.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Mưa thuận gió hòa, mùa màng tươi tốt nhà nhà ấm no.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Sống chan hòa cùng trời đất, trân trọng từng phút giây hiện hữu nhiệm màu.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Cười vui đón ánh ban mai, gieo niềm hy vọng cho ngày mới sang.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Gặp việc khó chớ thở dài, vững tâm bền chí chông gai cũng lùi.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Một niềm tin vững chãi xua tan bóng tối bão giông.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Sống có ích cho đời, nở hoa dâng mật ngọt ngào cho trần gian.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Tâm hồn rộng mở đón gió xuân, bình an hiện hữu trong từng phút giây.",
    author: "Thiền ngữ Việt Nam"
  },
  {
    content: "Thong dong dạo gót đường đời, mỉm cười đón nhận đất trời giao duyên.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đi khắp chân trời góc bể, quê hương vẫn là chốn bình yên nhất.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Đón bình minh rực rỡ, tạ ơn ngày mới an khang thịnh vượng.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Càng khiêm hạ hạt lúa càng cúi đầu, người càng thông thái càng khiêm nhường.",
    author: "Tục ngữ Việt Nam"
  },
  {
    content: "Tâm sáng thì đời rạng rỡ, lòng thành thì vạn sự an lành.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Mỗi ngày là một món quà vô giá của cuộc sống, hãy trân trọng và sống trọn vẹn.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Tạ ơn trời đất cho mùa màng bội thu, tạ ơn cuộc đời cho vạn mối lương duyên.",
    author: "Ca dao Việt Nam"
  },
  {
    content: "Giữ tâm thanh thản giữa dòng đời xuôi ngược, tìm thấy an yên ngay giữa chốn bụi trần.",
    author: "Thiền ngữ Việt Nam"
  },
  {
    content: "Nụ cười nở trên môi là mùa xuân đang ngự trị trong tâm hồn.",
    author: "Danh ngôn Việt Nam"
  },
  {
    content: "Một năm bốn mùa luân chuyển, bốn mùa tâm an vạn sự cát tường.",
    author: "Cổ huấn Việt Nam"
  },
  {
    content: "Chúc cho đất nước thái bình, nhà nhà ấm no, muôn người hạnh phúc và bình an.",
    author: "Lời chúc cổ truyền Việt Nam"
  }
];

console.log(`Tổng số câu danh ngôn đã chuẩn bị: ${quotes.length}`);

// Kiểm tra trùng lặp nội dung
const contentSet = new Set();
const duplicates = [];
quotes.forEach((q, idx) => {
  if (contentSet.has(q.content)) {
    duplicates.push({ idx, content: q.content });
  }
  contentSet.add(q.content);
});

if (duplicates.length > 0) {
  console.error('Phát hiện câu trùng lặp:', duplicates);
  process.exit(1);
}

// Nếu số lượng chưa đủ hoặc thừa 365, báo rõ
if (quotes.length < 365) {
  console.error(`Chưa đủ 365 câu! Hiện có: ${quotes.length}`);
  process.exit(1);
}

// Cắt đúng 365 câu đầu tiên
const finalQuotes = quotes.slice(0, 365);
console.log(`Xuất đúng ${finalQuotes.length} câu hoàn toàn độc nhất!`);

// Tạo mã nguồn TypeScript cho src/data/quotes/index.ts
const fileHeader = `/**
 * Bộ sưu tập 365 câu ca dao, tục ngữ, danh tác văn học & triết lý nhân sinh Việt Nam
 * Mỗi ngày trong năm 365 ngày tương ứng với một câu hoàn toàn độc nhất, không trùng lặp
 */

export interface DailyQuote {
  content: string;
  author: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
`;

const fileBody = finalQuotes
  .map((q) => {
    const escapedContent = q.content.replace(/'/g, "\\'");
    const escapedAuthor = q.author.replace(/'/g, "\\'");
    return `  {\n    content: '${escapedContent}',\n    author: '${escapedAuthor}',\n  },`;
  })
  .join('\n');

const fileFooter = `
];

/**
 * Lấy câu ca dao / tục ngữ / danh tác văn học tương ứng với ngày trong năm (1..365/366)
 * Đảm bảo 365 ngày trong năm hoàn toàn không bị trùng lặp
 */
export function getQuoteForDay(dayOfYear: number): DailyQuote {
  // dayOfYear thông thường chạy từ 1 đến 365 (hoặc 366 với năm nhuận)
  const index = Math.abs((dayOfYear || 1) - 1) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'quotes', 'index.ts');
fs.writeFileSync(outputPath, fileHeader + fileBody + fileFooter, 'utf8');
console.log(`Đã ghi thành công vào: ${outputPath}`);
