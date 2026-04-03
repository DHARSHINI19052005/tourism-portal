import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Footer } from '../footer/footer';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, Footer],
    templateUrl: './admin-dashboard.html',
    styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit, AfterViewInit {

    @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

    adminName = '';

    // ── Mock Revenue Data ────────────────────────────────────────────────────────
    kpis = [
        { icon: '💰', label: 'Total Revenue', value: '₹48.7L', sub: '+12.4% vs last month', color: '#10b981', trend: 'up' },
        { icon: '📦', label: 'Total Bookings', value: '3,842', sub: '+8.1% vs last month', color: '#6366f1', trend: 'up' },
        { icon: '🎯', label: 'Avg Booking Value', value: '₹12,680', sub: '-1.8% vs last month', color: '#f59e0b', trend: 'down' },
        { icon: '⭐', label: 'Customer Rating', value: '4.7 / 5', sub: 'Across 1,240 reviews', color: '#ec4899', trend: 'up' }
    ];

    topDestinations = [
        { rank: 1, name: 'Goa', revenue: '₹9,82,400', bookings: 342, growth: '+14%', badge: '🥇' },
        { rank: 2, name: 'Manali', revenue: '₹7,64,100', bookings: 287, growth: '+9%', badge: '🥈' },
        { rank: 3, name: 'Kerala', revenue: '₹6,91,200', bookings: 256, growth: '+6%', badge: '🥉' },
        { rank: 4, name: 'Rajasthan', revenue: '₹5,34,700', bookings: 213, growth: '+3%', badge: '4️⃣' },
        { rank: 5, name: 'Ooty', revenue: '₹4,12,800', bookings: 198, growth: '-2%', badge: '5️⃣' }
    ];

    revenueByDestination = {
        labels: ['Goa', 'Manali', 'Kerala', 'Rajasthan', 'Ooty', 'Shimla'],
        values: [982400, 764100, 691200, 534700, 412800, 387500]
    };

    monthlyRevenue = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        values: [3420000, 4150000, 5890000, 4280000, 5210000, 6340000]
    };

    bookingTypeSplit = {
        labels: ['Flights', 'Trains', 'Buses'],
        values: [52, 31, 17],
        colors: ['#6366f1', '#10b981', '#f59e0b']
    };

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const user = this.authService.currentUser;
        if (user) {
            this.adminName = user.fullName.split(' ')[0];
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this.drawAllCharts(), 100);
    }

    private drawAllCharts() {
        this.chartCanvases.forEach(ref => {
            const canvas = ref.nativeElement;
            const id = canvas.dataset['chartId'];
            switch (id) {
                case 'revenue-dest': this.drawVerticalBar(canvas, this.revenueByDestination, '#6366f1'); break;
                case 'monthly-rev': this.drawLine(canvas, this.monthlyRevenue, '#10b981'); break;
                case 'booking-split': this.drawDoughnut(canvas, this.bookingTypeSplit); break;
            }
        });
    }

    private setupCanvas(canvas: HTMLCanvasElement) {
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        const origW = parseFloat(canvas.getAttribute('width') || '300');
        const origH = parseFloat(canvas.getAttribute('height') || '150');
        const aspect = origH / origW;
        
        const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
        const logicalW = parentW > 50 ? parentW : origW;
        const logicalH = logicalW * aspect;
        
        canvas.width = logicalW * dpr;
        canvas.height = logicalH * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        return { ctx, w: logicalW, h: logicalH };
    }

    private fmt(n: number): string {
        if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
        if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
        return '₹' + n;
    }

    private drawVerticalBar(canvas: HTMLCanvasElement, data: { labels: string[], values: number[] }, color: string) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const max = Math.max(...data.values);
        const paddingBottom = 30, paddingTop = 22, paddingX = 16;
        const n = data.labels.length;
        const barW = Math.floor((w - paddingX * 2) / n) - 10;
        ctx.clearRect(0, 0, w, h);

        data.labels.forEach((label, i) => {
            const barH = ((data.values[i] / max) * (h - paddingBottom - paddingTop));
            const x = paddingX + i * (barW + 10);
            const y = h - paddingBottom - barH;

            const grad = ctx.createLinearGradient(0, y, 0, h - paddingBottom);
            grad.addColorStop(0, color);
            grad.addColorStop(1, color + '44');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
            ctx.fill();

            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barW / 2, h - 8);

            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.fillText(this.fmt(data.values[i]), x + barW / 2, y - 5);
        });
    }

    private drawLine(canvas: HTMLCanvasElement, data: { labels: string[], values: number[] }, color: string) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const max = Math.max(...data.values);
        const paddingBottom = 28, paddingTop = 20, paddingX = 24;
        const n = data.labels.length;
        ctx.clearRect(0, 0, w, h);

        const pts = data.values.map((v, i) => ({
            x: paddingX + (i / (n - 1)) * (w - paddingX * 2),
            y: paddingTop + (1 - v / max) * (h - paddingTop - paddingBottom)
        }));

        // Area fill
        const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, h - paddingBottom);
        areaGrad.addColorStop(0, color + '55');
        areaGrad.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.moveTo(pts[0].x, h - paddingBottom);
        pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pts[pts.length - 1].x, h - paddingBottom);
        ctx.closePath();
        ctx.fillStyle = areaGrad;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            const cpx = (pts[i - 1].x + pts[i].x) / 2;
            ctx.bezierCurveTo(cpx, pts[i - 1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dots + labels
        pts.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4.5, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.labels[i], p.x, h - 8);

            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.fillText(this.fmt(data.values[i]), p.x, p.y - 9);
        });
    }

    private drawDoughnut(canvas: HTMLCanvasElement, data: { labels: string[], values: number[], colors: string[] }) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const cx = w * 0.4, cy = h / 2;
        const outerR = Math.min(cx, cy) * 0.8;
        const innerR = outerR * 0.58;
        const total = data.values.reduce((a, b) => a + b, 0);
        let startAngle = -Math.PI / 2;
        ctx.clearRect(0, 0, w, h);

        data.values.forEach((val, i) => {
            const slice = (val / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
            ctx.arc(cx, cy, innerR, startAngle + slice, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = data.colors[i];
            ctx.fill();
            startAngle += slice;
        });

        // Center
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('100%', cx, cy + 5);

        // Legend
        const legendX = cx + outerR + 20;
        const legendStartY = cy - (data.labels.length * 28) / 2;
        data.labels.forEach((label, i) => {
            const ly = legendStartY + i * 32;
            ctx.fillStyle = data.colors[i];
            ctx.beginPath();
            ctx.roundRect(legendX, ly, 10, 10, 2);
            ctx.fill();
            ctx.fillStyle = '#475569';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(label, legendX + 16, ly + 9);
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillText(data.values[i] + '%', legendX + 16, ly + 22);
        });
    }
}
