var Layout=[
	[{n: 1},{n:59},{n:60},{n:61},{n:62},{n:63},{n:64},{n:65},{n:66},{n:67},{n:68},{n:87},{n:88},{n:69},{n:70}],//Fn
	[],
	[{    n:41},{n: 2},{n: 3},{n: 4},{n: 5},{n: 6},{n: 7},{n: 8},{n: 9},{n:10},{n:11},{n:12},{n:13},{t:3,n:14}],//Num
	[{t:3,n:15},{n:16},{n:17},{n:18},{n:19},{n:20},{n:21},{n:22},{n:23},{n:24},{n:25},{n:26},{n:27},{t:1,n:97}],
	[{t:4,n:58},{n:30},{n:31},{n:32},{n:33},{n:34},{n:35},{n:36},{n:37},{n:38},{n:39},{n:40},       {t:3,n:28}],
	[{t:5,n:42}       ,{n:44},{n:45},{n:46},{n:47},{n:48},{n:49},{n:50},{n:51},{n:52},{n:53},       {t:5,n:54}],
	[{t:2,n:29},{n:464},{n:125},{n:56},{n:57,t:6}                                          ,{n:100},{n:126},{t:2,n:97}],//ctrl...
];
var Modifier=[
	"shift",
	"lshift",
	"rshift",
	"alt",
	"lalt",
	"ralt",
	"ctrl",
	"lctrl",
	"rctrl",
	"meta",
	"lmeta",
	"rmeta",
	"sym",
	"fn",
	"capslock",
	"numlock",
	"scrolllock"
];

var Policy=[
	"WAKE",
	"WAKE_DROPPED",
	"SHIFT",
	"CAPS_LOCK",
	"ALT",
	"ALT_GR",
	"FUNCTION",
	"VIRTUAL",
	"MENU",
	"LAUNCHER",
];

//https://github.com/torvalds/linux/blob/master/include/uapi/linux/input.h
/* var t;ta.value.split('\n')
.map(function(a){var b=a.match(/(\w+)\s+(\w+)/);return b?[b[1],b[2]*1]:[];})
.filter(function(a){return a.length&&!isNaN(a[1])})
.forEach(function(a){t[a[1]]=a[0]});
*/
