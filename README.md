# 经典坦克大战

经典 FC 坦克大战 Web 重制版，基于 HTML5 Canvas + TypeScript 开发。

## 游戏截图

<!-- 截图待添加 -->

## 游戏功能

- 🎮 玩家控制坦克移动和射击
- 👾 多种敌方坦克类型（普通、快速、重型）
- 🗺️ 随机生成关卡
- 💥 可破坏的砖墙
- 🏆 计分系统和生命值
- ⏸️ 暂停功能（P 键）
- 📱 支持触摸控制

## 操作说明

| 操作 | 键盘 | 触摸 |
|------|------|------|
| 移动 | 方向键 | 虚拟摇杆 |
| 射击 | 空格键 | 射击按钮 |
| 暂停 | P 键 | - |

## 技术栈

- **语言**: TypeScript
- **渲染**: HTML5 Canvas
- **构建**: Vite
- **包管理**: npm

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── main.ts              # 入口文件
├── GameEngine.ts        # 游戏引擎
├── InputManager.ts      # 输入管理
├── Collision.ts         # 碰撞检测
├── entities/            # 游戏实体
│   ├── Entity.ts        # 实体基类
│   ├── Tank.ts          # 坦克基类
│   ├── PlayerTank.ts    # 玩家坦克
│   ├── EnemyTank.ts     # 敌方坦克
│   └── Bullet.ts        # 子弹
├── map/                 # 地图系统
│   └── Map.ts           # 地图类
└── utils/               # 工具
    ├── constants.ts     # 常量
    └── types.ts         # 类型定义
```

## 游戏规则

1. 消灭所有敌方坦克进入下一关
2. 每关难度递增（更多敌人、更快移动）
3. 保护基地，基地被摧毁游戏结束
4. 生命归零游戏结束

## License

MIT
