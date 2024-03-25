
Component({

	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		defaultNum: {
			type: String,
			default: ''
		},
		pop: {
			type: Boolean,
			value: false
		},
		must: { //是否必填
			type: Boolean,
			value: true
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		carNumArr: [],

		curInput: '',
		keyboard: false,
		keyboardType: 1,
		newEnergy: false,

		confirm: false, // 是否确认

		// 省份输入
		provinces: [
			['京', '沪', '粤', '津', '冀', '晋', '辽', '吉', '黑'],
			['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘'],
			['桂', '琼', '渝', '川', '贵', '云', '藏'],
			['陕', '甘', '青', '宁', '新', '蒙'],
		],
		// 地区输入
		areas: [
			["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
			["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"],
			["W", "X", "Y", "Z"]
		],
		// 车牌输入
		numbers: [
			["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
			["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"],
			["W", "X", "Y", "Z"]
		],
		// 最后一位输入
		last: [
			["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L"],
			["M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X"],
			["Y", "Z", "港", "澳", "学", "挂", "警"]
		]
	},

	lifetimes: {
		attached: function () { },

		ready: function () {
			if (this.data.defaultNum) {
				// 存在默认车牌号
				let length = this.data.defaultNum.length;
				if (length === 8) {
					// 新能源车牌号
					this.setData({
						newEnergy: true
					});
				}
				let carNumArr = this.data.defaultNum.split('');
				this.setData({
					carNumArr,
				}, () => {
					this.setData({
						confirm: this._numberValidate()
					});
				});


			}
		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		/**
		 * 关闭键盘
		 */
		bindCloseKeyboardTap() {
			this.setData({
				keyboard: false
			});
		},

		/**
		 * 显示省份键盘
		 */
		bindShowProvinceTap() {
			this.setData({
				keyboard: true,
				curInput: 0,
				keyboardType: 1
			});
		},

		bindShowPopTap: function (e) {
			this.setData({ pop: true });
		},

		/**
		 * 确定选择省份
		 */
		bindChooseProvinceTap(e) {
			const { val } = e.currentTarget.dataset;
			this.setData({
				'carNumArr[0]': val,
				curInput: 1,
				keyboardType: 2
			});
			this._change();
		},

		/**
		 * 删除选定省份
		 */
		bindDelProvinceTap() {
			this.setData({
				'carNumArr[0]': ''
			});
			this._change();
		},

		/**
		 * 显示地区键盘
		 */
		bindShowAreaTap() {
			this.setData({
				keyboard: true,
				curInput: 1,
				keyboardType: 2
			});
		},

		/**
		 * 选定地区
		 */
		bindChooseAreaTap(e) {
			const { val } = e.currentTarget.dataset
			this.setData({
				'carNumArr[1]': val,
				curInput: 2,
				keyboardType: 3
			});
			this._change();
		},

		/**
		 * 删除选定区域
		 */
		bindDelAreaTap() {
			this.setData({
				'carNumArr[1]': '',
				curInput: 0,
				keyboardType: 1
			})
			this._change();
		},

		/**
		 * 显示普通键盘
		 */
		bindShowNumberTap(e) {
			const { index } = e.currentTarget.dataset;
			const keyboardType = index === 6 && !this.data.newEnergy ? 4 : 3;
			this.setData({
				keyboard: true,
				curInput: index,
				keyboardType: keyboardType
			});
		},

		/**
		 * 选定车牌
		 */
		bindChooseNumberTap(e) {
			const { val } = e.currentTarget.dataset;
			const name = 'carNumArr[' + this.data.curInput + ']';
			this.setData({
				[name]: val,
				curInput: this.data.curInput + 1,
				keyboardType: 3
			})
			// 跳到最后一位时，键盘不一样
			if (this.data.curInput === 6 && !this.data.newEnergy) {
				this.setData({
					keyboardType: 4
				});
			} else if (this.data.curInput === 7 && this.data.newEnergy) {
				this.setData({
					keyboardType: 4
				});
			}
			this._change();
		},

		/**
		 * 删除车牌
		 */
		bindDelNumberTap() {
			const name = 'carNumArr[' + this.data.curInput + ']';
			this.setData({
				[name]: '',
				curInput: this.data.curInput - 1,
				keyboardType: 3
			});
			// 如果删除到地区时，切换键盘类型
			if (this.data.curInput === 1) {
				this.setData({
					keyboardType: 2
				});
			}
			this._change();
		},

		/**
		 * 显示最后一位键盘
		 */
		bindShowLastBoardTap() {
			if (this.data.newEnergy) {
				// 新能源
				this.setData({
					keyboard: true,
					curInput: 7,
					keyboardType: 4
				});
			} else {
				this.setData({
					keyboard: true,
					curInput: 6,
					keyboardType: 4
				});
			}
		},

		/**
		 * 选定最后一位
		 */
		bindChooseLastTap(e) {
			const { val } = e.currentTarget.dataset;
			if (this.data.newEnergy) {
				// 新能源
				this.setData({
					'carNumArr[7]': val,
					curInput: this.data.curInput + 1,
					keyboard: false
				});
			} else {
				this.setData({
					'carNumArr[6]': val,
					curInput: this.data.curInput + 1,
					keyboard: false
				});
			}
			this._change();
		},

		/**
		 * 删除最后一位
		 */
		bindDelLastTap() {
			if (this.data.newEnergy) {
				this.setData({
					'carNumArr[7]': '',
					curInput: this.data.curInput - 1,
					keyboardType: 3,
					newEnergy: false
				});
			} else {
				this.setData({
					'carNumArr[6]': '',
					curInput: this.data.curInput - 1,
					keyboardType: 3
				});
			}

			this._change();
		},

		/**
		 * 切换输入新能源车牌号
		 */
		bindNewEnergyTap() {
			this.setData({
				newEnergy: true
			});
			this.bindShowLastBoardTap();
		},

		_change: function () {
			this.setData({
				confirm: this._numberValidate()
			});
		},

		bindConfirmTap: function (e) {
			if (!this._numberValidate()) return;
			this.setData({
				pop: false
			});

			// 每次都触发 change 事件，通知父组件
			this.triggerEvent('change', { value: this.data.carNumArr.join('') });
		},

		bindClearTap: function (e) {
			this.setData({
				carNumArr: []
			}, () => {
				this.setData({
					confirm: this._numberValidate()
				});
			});
		},

		_numberValidate: function () {
			// 是否合法
			let carNumArr = this.data.carNumArr;
			let carNumStr = carNumArr.join('');

			if (carNumStr.length == 0 && !this.data.must) return true;

			if (carNumStr.length < 7 || carNumStr.length > 8) return false;

			if (carNumArr.length != carNumStr.length && carNumArr[carNumArr.length - 1])
				return false;
			else
				return true;
		}
	}
})

